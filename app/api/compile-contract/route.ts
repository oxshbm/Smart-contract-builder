// app/api/compile-contract/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';

// This route handles the compilation of Rust code to WASM
// It requires Rust and the cargo-contract tools to be installed on the server
export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    // Validate input
    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    // Create a temporary directory for the contract
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'multiversx-contract-'));
    const contractId = crypto.randomBytes(8).toString('hex');
    const contractDir = path.join(tmpDir, `contract-${contractId}`);
    
    try {
      // Create project structure
      await fs.mkdir(contractDir, { recursive: true });
      await fs.mkdir(path.join(contractDir, 'src'));
      
      // Create Cargo.toml
      const cargoToml = `
[package]
name = "multiversx-contract"
version = "0.1.0"
edition = "2021"

[lib]
path = "src/lib.rs"

[dependencies]
multiversx-sc = "0.43.4"

[dev-dependencies]
multiversx-sc-scenario = "0.43.4"
`;
      
      await fs.writeFile(path.join(contractDir, 'Cargo.toml'), cargoToml);
      
      // Write the contract code
      await fs.writeFile(path.join(contractDir, 'src', 'lib.rs'), code);
      
      // Run the compilation
      // Note: This requires Rust and MultiversX toolchain to be installed
      return new Promise((resolve, reject) => {
        exec(
          'cd ' + contractDir + ' && mxpy contract build',
          { maxBuffer: 5 * 1024 * 1024 }, // 5MB buffer to handle large output
          async (error, stdout, stderr) => {
            try {
              if (error) {
                console.error('Compilation error:', stderr);
                resolve(NextResponse.json({ 
                  error: `Compilation failed: ${stderr}` 
                }, { status: 500 }));
                return;
              }
              
              // If successful, read the WASM file
              try {
                const wasmPath = path.join(contractDir, 'output', 'multiversx-contract.wasm');
                const wasmBinary = await fs.readFile(wasmPath);
                
                // Convert to base64 for transmission
                const wasmBase64 = wasmBinary.toString('base64');
                
                resolve(NextResponse.json({ wasmBase64 }));
              } catch (readError) {
                console.error('Error reading WASM file:', readError);
                resolve(NextResponse.json({ 
                  error: 'Error reading compiled WASM file' 
                }, { status: 500 }));
              }
            } finally {
              // Clean up temporary directory
              try {
                await fs.rm(tmpDir, { recursive: true, force: true });
              } catch (cleanupError) {
                console.error('Error cleaning up temporary directory:', cleanupError);
              }
            }
          }
        );
      });
    } catch (processingError) {
      // Ensure cleanup happens even if there's an error
      try {
        await fs.rm(tmpDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Error cleaning up after processing error:', cleanupError);
      }
      
      throw processingError;
    }
  } catch (error) {
    console.error('Contract compilation error:', error);
    return NextResponse.json({
      error: error.message || 'Failed to compile contract'
    }, { status: 500 });
  }
}

// Ensure this is a dynamic route
export const dynamic = 'force-dynamic';