import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ImageIcon } from 'lucide-react';
import { LoadingScreen } from '@/components/LoadingScreen';

// Dynamically import the ImageGenerator to reduce initial bundle size
const ImageGenerator = dynamic(() => import('@/components/ImageGenerator').then(mod => ({ default: mod.ImageGenerator })), {
  loading: () => <LoadingScreen />,
  ssr: false // Disable SSR for this component to reduce server load
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-accent/20 dark:from-background dark:to-accent/5">
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center">
            <div className="p-2 bg-primary/10 rounded-lg mr-3">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              GEN IMAGE
            </h1>
          </div>
          <ThemeToggle />
        </header>
        
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Transform Your Words into Art</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Create stunning, unique images with the power of AI. Simply describe what you want to see, 
            and watch as your imagination comes to life!
          </p>
        </div>
        
        <Suspense fallback={<LoadingScreen />}>
          <ImageGenerator />
        </Suspense>
        
        <footer className="mt-20 text-center text-sm text-muted-foreground py-6 border-t border-border">
          <p>Developed by PURVIK</p>
        </footer>
      </div>
      
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>
    </main>
  );
}