"use client";

import { useState, lazy, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ImageIcon, Download, Copy, Sparkles, Zap, Share2, ClipboardCopy, Maximize, FileImage } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Form validation schema
const formSchema = z.object({
  prompt: z.string().min(1, {
    message: 'Please enter a prompt',
  }),
  model: z.enum(['flux-schnell', 'sdxl'], {
    required_error: 'Please select a model',
  }),
  size: z.string().default('1024x1024'),
});

const modelData = {
  'flux-schnell': {
    name: 'Flux Schnell',
    description: 'Fast generation with 4 inference steps',
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
  },
  'sdxl': {
    name: 'Stability SDXL',
    description: 'High quality with 30 inference steps',
    icon: <Sparkles className="h-5 w-5 text-purple-500" />,
  }
};

// Available image size options
const imageSizes = [
  { value: '512x512', label: '512×512', description: 'Small - Quick Generation' },
  { value: '768x768', label: '768×768', description: 'Medium' },
  { value: '1024x1024', label: '1024×1024', description: 'Large - Square' },
  { value: '1024x1536', label: '1024×1536', description: 'Large - Portrait' },
  { value: '1536x1024', label: '1536×1024', description: 'Large - Landscape' },
];

export function ImageGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [revisedPrompt, setRevisedPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      model: 'flux-schnell',
      size: '1024x1024',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    
    try {
      // Extract width and height from the size string
      const [width, height] = values.size.split('x').map(Number);
      
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: values.prompt,
          model: values.model,
          width,
          height
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }
      
      // Data now contains base64 encoded image
      setImage(`data:image/webp;base64,${data.imageData}`);
      setRevisedPrompt(data.revisedPrompt || null);
      
      // Replace toast with console message
      console.log("Image generated successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
      
      // Replace toast with console error
      console.error("Error generating image:", errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const handleDownload = async (format = 'webp') => {
    if (!image) return;
    
    try {
      // For base64 images
      const a = document.createElement('a');
      a.href = image;
      a.download = `ai-image-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Replace toast with console log
      console.log(`Image downloaded as ${format.toUpperCase()}`);
    } catch (err) {
      // Replace toast with console error
      console.error("Download failed:", err);
    }
  };

  const copyImageToClipboard = async () => {
    if (!image) return;
    
    try {
      // Create a blob from the image data
      const response = await fetch(image);
      const blob = await response.blob();
      
      // Use clipboard API to copy image
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      // Replace toast with console log
      console.log("Image copied to clipboard");
    } catch (err) {
      // Replace toast with console error
      console.error("Copy failed:", err);
    }
  };

  const shareImage = async () => {
    if (!image || !navigator.share) return;
    
    try {
      // Convert base64 to blob
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], 'ai-image.webp', { type: 'image/webp' });
      
      await navigator.share({
        title: 'AI Generated Image',
        text: revisedPrompt || 'Check out this AI generated image!',
        files: [file]
      });
      
      // Replace toast with console log
      console.log("Share dialog opened successfully");
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        // Replace toast with console error
        console.error("Share failed:", err);
      }
    }
  };
  
  const copyPrompt = () => {
    if (!revisedPrompt) return;
    
    navigator.clipboard.writeText(revisedPrompt);
    // Replace toast with console log
    console.log("Prompt copied to clipboard");
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Options</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          </TabsList>
          
          <Card className="overflow-hidden border-2 bg-background/30 backdrop-blur-sm mt-4">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-8">
              <CardTitle className="text-2xl">Generate an Image</CardTitle>
              <CardDescription>
                Enter a detailed description of the image you want to create
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium">Prompt</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="A magical forest with glowing mushrooms and fairy lights..." 
                              {...field} 
                              className="h-24 pl-4 pr-12 py-3 text-base shadow-sm transition-all focus-visible:ring-primary/60"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              <ImageIcon className="h-5 w-5 opacity-70" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <TabsContent value="basic" className="mt-0 space-y-6">
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-lg font-medium">Select AI Model</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                              {Object.entries(modelData).map(([value, data]) => (
                                <motion.div
                                  key={value}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <label
                                    htmlFor={`model-${value}`}
                                    className={`flex items-start space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all hover:bg-accent/40 ${
                                      field.value === value 
                                        ? 'border-primary bg-accent/60 shadow-md' 
                                        : 'border-border hover:border-primary/30'
                                    }`}
                                  >
                                    <RadioGroupItem 
                                      value={value} 
                                      id={`model-${value}`} 
                                      className="mt-1" 
                                    />
                                    <div className="space-y-1.5">
                                      <div className="flex items-center">
                                        {data.icon}
                                        <span className="ml-2 font-medium">{data.name}</span>
                                      </div>
                                      <p className="text-sm text-muted-foreground">{data.description}</p>
                                    </div>
                                  </label>
                                </motion.div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="mt-0 space-y-6">
                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-medium">Image Size</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                            {imageSizes.map((size) => (
                              <motion.div
                                key={size.value}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div
                                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-accent/40 ${
                                    field.value === size.value
                                      ? 'border-primary bg-accent/60 shadow-md'
                                      : 'border-border hover:border-primary/30'
                                  }`}
                                  onClick={() => form.setValue('size', size.value)}
                                >
                                  <div className="flex items-center">
                                    <Maximize className="h-4 w-4 mr-2 text-primary/70" />
                                    <span className="font-medium">{size.label}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">{size.description}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-medium">AI Model</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(modelData).map(([value, data]) => (
                                <SelectItem key={value} value={value}>
                                  <div className="flex items-center">
                                    {data.icon}
                                    <span className="ml-2">{data.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full relative overflow-hidden group h-12"
                  >
                    <motion.div
                      initial={false}
                      animate={{ 
                        x: loading ? '100%' : '-100%',
                      }}
                      transition={{ 
                        repeat: loading ? Infinity : 0, 
                        duration: 1,
                        ease: "linear"
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -z-10"
                    />
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate Image
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </Tabs>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 text-destructive p-4 rounded-md"
        >
          {error}
        </motion.div>
      )}

      <AnimatePresence>
        {image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-primary" />
                  Generated Image
                </CardTitle>
                {revisedPrompt && (
                  <div className="mt-2">
                    <CardDescription className="flex items-start">
                      <div className="flex-1 pr-2">
                        <span className="font-medium text-primary">Revised prompt:</span> {revisedPrompt}
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={copyPrompt}
                        className="flex-shrink-0 h-6 w-6"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </CardDescription>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative rounded-md overflow-hidden">
                  <motion.img 
                    src={image} 
                    alt="AI generated image" 
                    className="w-full object-contain"
                    initial={{ filter: 'blur(10px)' }}
                    animate={{ filter: 'blur(0px)' }}
                    transition={{ duration: 0.5 }}
                    loading="eager"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center flex-wrap gap-2 pt-6 pb-4">
                <div className="text-sm text-muted-foreground">
                  {form.watch('size')} • {modelData[form.watch('model') as keyof typeof modelData].name}
                </div>
                <div className="flex gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={copyImageToClipboard}
                      title="Copy to clipboard"
                    >
                      <ClipboardCopy className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  
                  {typeof navigator !== 'undefined' && 'share' in navigator && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={shareImage}
                        title="Share image"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button>
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDownload('webp')}>
                          <FileImage className="mr-2 h-4 w-4" />
                          <span>Export as WebP</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload('png')}>
                          <FileImage className="mr-2 h-4 w-4" />
                          <span>Export as PNG</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload('jpg')}>
                          <FileImage className="mr-2 h-4 w-4" />
                          <span>Export as JPG</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}