'use client';

import { useState, useEffect, useRef } from 'react';

interface GoogleDriveMediaProps {
  src: string;
  alt: string;
  variant: 'card' | 'detail';
  className?: string;
  fallbackChar?: string;
}

export function parseGoogleDriveUrl(url: string) {
  if (!url) return { isDrive: false, url: '', directUrl: '', embedUrl: '', fileId: '' };

  let fileId = '';
  // Match drive.google.com/file/d/FILE_ID/...
  const fileDMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (fileDMatch) {
    fileId = fileDMatch[1];
  } else {
    // Match drive.google.com/open?id=FILE_ID or docs.google.com/uc?id=FILE_ID
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
    if (idMatch) {
      fileId = idMatch[1];
    }
  }

  if (fileId) {
    return {
      isDrive: true,
      fileId,
      url,
      directUrl: `https://docs.google.com/uc?export=download&id=${fileId}`,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    };
  }

  return { isDrive: false, url, directUrl: url, embedUrl: url, fileId: '' };
}

export default function GoogleDriveMedia({
  src,
  alt,
  variant,
  className = '',
  fallbackChar = '?',
}: GoogleDriveMediaProps) {
  const [mediaUrl, setMediaUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [fileId, setFileId] = useState('');
  const [isDrive, setIsDrive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detectedType, setDetectedType] = useState<'image' | 'video' | 'iframe' | 'error'>('image');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!src) {
      setLoading(false);
      setDetectedType('error');
      return;
    }

    setLoading(true);
    const parsed = parseGoogleDriveUrl(src);
    const targetUrl = parsed.isDrive ? parsed.directUrl : src;
    setMediaUrl(targetUrl);
    setEmbedUrl(parsed.embedUrl);
    setFileId(parsed.fileId);
    setIsDrive(parsed.isDrive);

    // 1. Detect by extension first
    const cleanUrl = targetUrl.split('?')[0].split('#')[0];
    if (/\.(mp4|webm|ogg|mov|m4v)$/i.test(cleanUrl)) {
      setDetectedType('video');
      setLoading(false);
      return;
    }
    if (/\.(png|jpe?g|gif|webp|svg|bmp)$/i.test(cleanUrl)) {
      setDetectedType('image');
      setLoading(false);
      return;
    }

    // 2. Proactively probe content-type via fetch if extension is unknown (e.g. Google Drive URLs)
    let isMounted = true;
    const probeMediaType = async () => {
      try {
        const response = await fetch(targetUrl, { method: 'GET' });
        const contentType = response.headers.get('content-type');
        const contentDisposition = response.headers.get('content-disposition');
        
        let type: 'image' | 'video' | null = null;

        // Check content-disposition filename first since Drive serves application/octet-stream
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
          if (filenameMatch) {
            const filename = filenameMatch[1];
            if (/\.(mp4|webm|ogg|mov|m4v)$/i.test(filename)) {
              type = 'video';
            } else if (/\.(png|jpe?g|gif|webp|svg|bmp)$/i.test(filename)) {
              type = 'image';
            }
          }
        }

        // Check content-type header as fallback
        if (!type && contentType) {
          if (contentType.startsWith('video/')) {
            type = 'video';
          } else if (contentType.startsWith('image/')) {
            type = 'image';
          }
        }

        if (type && isMounted) {
          setDetectedType(type);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('CORS or network error detecting media type via GET, falling back to sequential loader.', err);
      }

      // If network probe fails, default to image and let error events handle fallback
      if (isMounted) {
        setDetectedType('image');
        setLoading(false);
      }
    };

    probeMediaType();

    return () => {
      isMounted = false;
    };
  }, [src]);

  // Autoplay video if detected
  useEffect(() => {
    if (detectedType === 'video' && videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay prevented by browser permissions:', err);
      });
    }
  }, [detectedType, mediaUrl]);

  const handleImageError = () => {
    console.log('Image load failed, attempting video fallback for:', mediaUrl);
    setDetectedType('video');
  };

  const handleVideoError = () => {
    if (isDrive && fileId) {
      // If native video playback fails (e.g. .mov in Chromium), fall back to Drive iframe player
      console.log('Native video failed. Falling back to Google Drive iframe for:', fileId);
      setDetectedType('iframe');
      setLoading(false);
    } else {
      console.log('Video load failed for:', mediaUrl);
      setDetectedType('error');
    }
  };

  if (detectedType === 'error') {
    return (
      <div className={`media-container ${variant === 'card' ? 'card-media-wrapper' : 'detail-media-wrapper'} ${className}`}>
        <div className={`media-fallback ${variant === 'detail' ? 'media-fallback-dark' : ''}`}>
          <span className="media-fallback-icon">⚠️</span>
          <span>Unable to load media</span>
          {variant === 'card' && fallbackChar && (
            <div className="card-image-placeholder" style={{ marginTop: '0.5rem', width: '40px', height: '40px', borderRadius: '50%' }}>
              {fallbackChar}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`media-container ${variant === 'card' ? 'card-media-wrapper' : 'detail-media-wrapper'} ${className}`}>
      {loading && (
        <div className={variant === 'detail' ? 'media-loading' : 'media-loading-card'}>
          <div className={`media-loading-spinner ${variant === 'card' ? 'media-loading-spinner-dark' : ''}`}></div>
        </div>
      )}

      {detectedType === 'image' && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={mediaUrl}
          alt={alt}
          onLoad={() => setLoading(false)}
          onError={handleImageError}
          style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.2s ease' }}
        />
      )}

      {detectedType === 'video' && (
        <video
          ref={videoRef}
          src={mediaUrl}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setLoading(false)}
          onError={handleVideoError}
          style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.2s ease' }}
        />
      )}

      {detectedType === 'iframe' && (
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 'none', opacity: loading ? 0 : 1, transition: 'opacity 0.2s ease' }}
          onLoad={() => setLoading(false)}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      )}
    </div>
  );
}
