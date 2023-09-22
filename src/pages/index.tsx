import { Url } from 'next/dist/shared/lib/router/router';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  
  const buttons = [
    { label: "Text DropDown", path: "dropdowntext" },
  ];
  
    const handleButtonClick = (path: Url) => {
    router.push(path);
  }

  return (
    <div>
      {buttons.map((button, index) => (
        <button 
          key={index}
          onClick={() => handleButtonClick(button.path)}
          style={{ width: '300px', height: '30px', display: 'block', marginBottom: '10px' }}>
          {button.label}
        </button>
      ))}
    </div>
  );
}