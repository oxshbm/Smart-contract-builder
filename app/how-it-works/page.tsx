import Link from 'next/link';
import Image from 'next/image';

export default function HowItWorks() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-[#3366FF]">How MultiversX builder Works</h1>
        <p className="text-xl text-gray-600">
          A step-by-step guide to building and deploying smart contracts on MultiversX
        </p>
      </header>

      <section className="space-y-12">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-6 text-[#3366FF]">1. Choose Your Components</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="mb-4">
                MultiversX provides a library of pre-built smart contract components optimized for MultiversX.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Meta Transaction Handlers</li>
                <li>ESDT Token Implementations</li>
                <li>Role-Based Access Control</li>
                <li>Bridge Adapters</li>
                <li>Gas Optimization Utilities</li>
                <li>NFT Contract Templates</li>
              </ul>
            </div>
            <div>
                <Image 
                    src="/components.png"  // Path starts from public folder
                    alt="Choose your components"
                    width={400}  // Specify width
                    height={300}  // Specify height
                    className="rounded-lg shadow-md"
                />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-6 text-[#3366FF]">2. Drag and Compose</h2>
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <p className="mb-4">
                        Use our intuitive drag-and-drop interface to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Reorder components</li>
                        <li>Remove unnecessary modules</li>
                        <li>See real-time code generation</li>
                        <li>Visualize your contract&apos;s structure</li>
                    </ul>
                    <p className="mt-4 italic text-gray-600">
                        Each drag updates the generated Rust code instantly!
                    </p>
                </div>
                <div>
                    <Image 
                        src="/drag-drop.png"  // Path starts from public folder
                        alt="Drag and Compose"
                        width={400}  // Specify width
                        height={300}  // Specify height
                        className="rounded-lg shadow-md"
                    />
                </div>
            </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-6 text-[#3366FF]">3. Deploy with Ease</h2>
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <p className="mb-4">
                        Deploy your contract directly to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>MultiversX Mainnet</li>
                        <li>MultiversX Devnet</li>
                        <li>MultiversX Testnet</li>
                    </ul>
                    <p className="mt-4">
                        Requirements:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>MultiversX Web Wallet or xPortal Mobile App</li>
                        <li>Sufficient EGLD for Gas Fees</li>
                    </ul>
                </div>
                <div>
                    <Image 
                        src="/deploy.png"  // Path starts from public folder
                        alt="Deployment Process"
                        width={400}  // Specify width
                        height={300}  // Specify height
                        className="rounded-lg shadow-md"
                    />
                </div>
            </div>
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/builder" 
            className="bg-[#3366FF] text-white px-8 py-3 rounded-full text-xl hover:bg-[#3366FF]/90 transition-colors"
          >
            Start Building Now
          </Link>
        </div>
      </section>
    </div>
  );
}