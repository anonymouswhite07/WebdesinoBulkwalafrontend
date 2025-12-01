import React from 'react';

// Responsive utility component for consistent responsive behavior
const ResponsiveUtils = () => {
  return null; // This is a utility component, no rendering needed
};

// Utility functions for responsive design
export const useResponsive = () => {
  const [windowSize, setWindowSize] = React.useState({
    width: undefined,
    height: undefined,
  });

  const [deviceType, setDeviceType] = React.useState('mobile');

  React.useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Determine device type based on width
      if (window.innerWidth < 768) {
        setDeviceType('mobile');
      } else if (window.innerWidth < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { windowSize, deviceType };
};

// Responsive image component with proper scaling
export const ResponsiveImage = ({ 
  src, 
  alt, 
  className = "", 
  maxWidth = "100%", 
  maxHeight = "auto",
  objectFit = "cover",
  ...props 
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`scalable-img ${className}`}
      style={{
        maxWidth: maxWidth,
        maxHeight: maxHeight,
        objectFit: objectFit,
        height: 'auto',
        display: 'block'
      }}
      {...props}
    />
  );
};

// Responsive container component
export const ResponsiveContainer = ({ 
  children, 
  className = "", 
  fluid = false,
  padding = true,
  ...props 
}) => {
  const containerClass = fluid 
    ? `w-full ${padding ? 'px-4 sm:px-6' : ''}`
    : `responsive-container ${padding ? 'px-4 sm:px-6' : ''}`;

  return (
    <div className={`${containerClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Responsive grid component
export const ResponsiveGrid = ({ 
  children, 
  cols = 1, 
  gap = 4,
  className = "",
  ...props 
}) => {
  // Base grid classes
  const baseClasses = "grid-responsive";
  
  // Gap classes
  const gapClasses = `gap-${gap}`;
  
  // Column classes based on responsive breakpoints
  let colClasses = "";
  switch (cols) {
    case 1:
      colClasses = "grid-cols-1";
      break;
    case 2:
      colClasses = "grid-cols-1 sm:grid-cols-2";
      break;
    case 3:
      colClasses = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      break;
    case 4:
      colClasses = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      break;
    case 5:
      colClasses = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
      break;
    case 6:
      colClasses = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xxl:grid-cols-6";
      break;
    default:
      colClasses = "grid-cols-1";
  }

  return (
    <div 
      className={`${baseClasses} ${colClasses} ${gapClasses} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

// Responsive card component
export const ResponsiveCard = ({ 
  children, 
  className = "", 
  padding = true,
  shadow = true,
  rounded = true,
  ...props 
}) => {
  const cardClasses = [
    'card-responsive',
    padding ? 'p-4 sm:p-6' : '',
    shadow ? 'shadow-sm hover:shadow-md' : '',
    rounded ? 'rounded-lg' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

// Responsive button component
export const ResponsiveButton = ({ 
  children, 
  className = "", 
  size = "md",
  variant = "primary",
  fullWidth = false,
  ...props 
}) => {
  // Size classes
  const sizeClasses = {
    sm: "btn-responsive text-sm px-3 py-1.5 sm:px-4 sm:py-2",
    md: "btn-responsive text-base px-4 py-2 sm:px-6 sm:py-3",
    lg: "btn-responsive text-lg px-6 py-3 sm:px-8 sm:py-4"
  };

  // Variant classes
  const variantClasses = {
    primary: "bg-[#02066F] text-white hover:bg-[#04127A]",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border border-[#02066F] text-[#02066F] hover:bg-[#02066F] hover:text-white",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  const buttonClasses = [
    "btn-responsive",
    sizeClasses[size],
    variantClasses[variant],
    fullWidth ? "w-full" : "",
    "transition-all duration-300 font-medium rounded-md",
    className
  ].filter(Boolean).join(' ');

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

// Responsive text component
export const ResponsiveText = ({ 
  children, 
  className = "", 
  size = "base",
  weight = "normal",
  color = "text-gray-800",
  ...props 
}) => {
  // Size classes
  const sizeClasses = {
    xs: "responsive-text-sm",
    sm: "responsive-text",
    base: "responsive-text",
    lg: "responsive-text-lg",
    xl: "responsive-text-xl",
    "2xl": "responsive-text-2xl",
    "3xl": "responsive-text-3xl",
    "4xl": "responsive-text-4xl"
  };

  // Weight classes
  const weightClasses = {
    thin: "font-thin",
    extralight: "font-extralight",
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
    black: "font-black"
  };

  const textClasses = [
    sizeClasses[size],
    weightClasses[weight],
    color,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={textClasses} {...props}>
      {children}
    </span>
  );
};

// Responsive form element
export const ResponsiveInput = ({ 
  className = "", 
  size = "md",
  fullWidth = true,
  ...props 
}) => {
  // Size classes
  const sizeClasses = {
    sm: "form-element-responsive text-sm px-2 py-1.5 sm:px-3 sm:py-2",
    md: "form-element-responsive text-base px-3 py-2 sm:px-4 sm:py-3",
    lg: "form-element-responsive text-lg px-4 py-3 sm:px-5 sm:py-4"
  };

  const inputClasses = [
    "form-element-responsive",
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    "border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#02066F] focus:border-transparent",
    className
  ].filter(Boolean).join(' ');

  return (
    <input className={inputClasses} {...props} />
  );
};

// Responsive navigation component
export const ResponsiveNav = ({ 
  children, 
  className = "", 
  vertical = false,
  ...props 
}) => {
  const navClasses = [
    "nav-responsive",
    vertical ? "flex-col" : "flex-row",
    className
  ].filter(Boolean).join(' ');

  return (
    <nav className={navClasses} {...props}>
      {children}
    </nav>
  );
};

export default ResponsiveUtils;