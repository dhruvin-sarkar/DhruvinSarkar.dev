import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isKnownBlockedSite } from '../utils/siteDatabase';

const BrowserFrame = ({ 
  url, 
  isLoading, 
  onLoadStart, 
  onLoadEnd, 
  onLoadError 
}) => {
  const iframeRef = useRef(null);
  const mountedRef = useRef(true);
  
  useEffect(() => {
    mountedRef.current = true;
    const iframe = iframeRef.current;
    if (!iframe) return;
    
    // Check if this is a known blocked site
    if (isKnownBlockedSite(url) && !url.startsWith('about:')) {
      const timeoutId = setTimeout(() => {
        if (mountedRef.current) {
          onLoadError({
            type: 'BLOCKED_SITE',
            url: url,
            message: 'This site cannot be displayed in an iframe.',
            reason: 'This website is known to block iframe embedding for security reasons. This is a common practice for major websites to prevent clickjacking attacks.',
          });
          onLoadEnd();
        }
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
    
    onLoadStart();
    
    const handleLoad = () => {
      if (mountedRef.current) {
        onLoadEnd();
        
        // Try to detect if iframe loaded successfully
        // Cross-origin iframes will throw error when accessing contentWindow
        try {
          const iframeDoc = iframe.contentWindow.document;
          // If we can access it, it loaded successfully
        } catch (e) {
          // Cross-origin - this is actually expected and OK
          // Site loaded but we can't access it due to same-origin policy
        }
      }
    };
    
    const handleError = () => {
      if (mountedRef.current) {
        onLoadEnd();
        onLoadError({
          type: 'LOAD_ERROR',
          url: url,
          message: 'This site cannot be displayed in an iframe.',
          reason: 'Modern websites use security headers (X-Frame-Options, CSP) to prevent embedding and protect against clickjacking attacks.',
        });
      }
    };
    
    // Set up event listeners
    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);
    
    // Detect X-Frame-Options blocking with timeout
    const timeoutId = setTimeout(() => {
      if (mountedRef.current && url !== 'about:start' && url !== 'about:blank') {
        try {
          // If we can't access contentWindow.location, it might be blocked
          const iframeContent = iframe.contentWindow;
          if (iframeContent) {
            // This will throw if blocked by same-origin policy
            iframeContent.location.href;
          }
        } catch (e) {
          // Cross-origin or blocked - check if it's been too long
          if (e.name === 'SecurityError') {
            // This is expected for cross-origin sites, but if it's been a while, might be blocked
            console.log('Cross-origin iframe detected (normal for most sites)');
          }
        }
      }
    }, 3000);
    
    return () => {
      mountedRef.current = false;
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
      clearTimeout(timeoutId);
    };
  }, [url, onLoadStart, onLoadEnd, onLoadError]);

  return (
    <div className="ie-browser-frame">
      {isLoading && (
        <div className="ie-loading-overlay">
          <div className="ie-loading-text">Loading...</div>
        </div>
      )}
      <iframe
        key={url}
        ref={iframeRef}
        src={url === 'about:start' ? 'about:blank' : url}
        className="ie-iframe"
        title="Browser content"
        allow="fullscreen"
      />
    </div>
  );
};

BrowserFrame.propTypes = {
  url: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  onLoadStart: PropTypes.func.isRequired,
  onLoadEnd: PropTypes.func.isRequired,
  onLoadError: PropTypes.func.isRequired,
};

export default BrowserFrame;
