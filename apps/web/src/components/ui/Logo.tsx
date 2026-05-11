import { cn } from '@/src/lib/utils';
import  LogoImg from '../../../../../public/logo-b.png'
interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showText?: boolean;
  textClass?: string;
  className?: string;
}

const sizeMap = {
  xs: { img: 'h-6',  text: 'text-sm' },
  sm: { img: 'h-8',  text: 'text-base' },
  md: { img: 'h-10', text: 'text-xl' },
  lg: { img: 'h-14', text: 'text-3xl' },
};

export function Logo({ size = 'sm', showText = false, textClass, className }: LogoProps) {
  const s = sizeMap[size];
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <img
        src={LogoImg}
        alt="WardSuite ERP"
        className={cn(s.img, 'w-30 h-30 object-contain')}
      />
      {showText && (
        <span className={cn('font-bold tracking-tight text-black', s.text, textClass)}>
          WardSuite <span className="font-black text-[#6b7280] text-[0.6em] uppercase tracking-[0.15em]">ERP</span>
        </span>
      )}
    </div>
  );
}
