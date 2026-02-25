import { useEffect } from 'react';
import './GoogleAd.css';

function GoogleAd({ 
  slot, 
  format = 'auto', 
  responsive = true,
  style = {}
}) {
  useEffect(() => {
    try {
      // Push ad to AdSense
      if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  // Show placeholder in development
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div className="google-ad-placeholder" style={style}>
        <div className="ad-placeholder-content">
          <span className="ad-label">Google Ad</span>
          <p>Ad Slot: {slot}</p>
          <p className="ad-note">Ads will appear here in production</p>
        </div>
      </div>
    );
  }

  return (
    <div className="google-ad-container" style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
}

export default GoogleAd;
