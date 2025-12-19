import styles from '@/components/FormInput/styles.module.css';
import Image, { StaticImageData } from 'next/image';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: StaticImageData;
  onIconClick?: () => void;
}

export function Input({ icon, onIconClick, ...props }: InputProps) {
  return (
    <div className={styles.inputWrapper}>
      <input {...props} className={styles.input} />
      {icon && (
        <button type="button" className={styles.eyeIcon} onClick={onIconClick}>
          <Image src={icon} alt="icon" />
        </button>
      )}
    </div>
  );
}