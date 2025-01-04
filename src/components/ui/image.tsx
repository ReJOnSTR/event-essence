import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  loadingHeight?: string | number;
}

export function Image({ 
  src, 
  alt, 
  className, 
  fallback = "/placeholder.svg",
  loadingHeight = "200px",
  ...props 
}: ImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
    setLoading(true);
    setError(false);
  }, [src]);

  const handleError = () => {
    setError(true);
    setImgSrc(fallback);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  if (loading) {
    return <Skeleton style={{ height: loadingHeight }} className={cn("w-full rounded-lg", className)} />;
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={cn("w-full h-auto", className)}
      onError={handleError}
      onLoad={handleLoad}
      loading="lazy"
      {...props}
    />
  );
}