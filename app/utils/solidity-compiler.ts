const loadSolc = async () => {
    if (typeof window === 'undefined') return null;
    return await import('solc');
};

export const compileSolidity = async (sourceCode: string) => {
    const solc = await loadSolc();
    if (!solc) return null;

    const input = {
        language: 'Solidity',
        sources: {
            'contract.sol': {
                content: sourceCode
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            },
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    if (output.errors) {
        const errors = output.errors.filter(error => error.severity === 'error');
        if (errors.length > 0) {
            throw new Error(errors[0].message);
        }
    }

    const contract = output.contracts['contract.sol']['GeneratedContract'];
    return {
        abi: contract.abi,
        bytecode: contract.evm.bytecode.object
    };
};