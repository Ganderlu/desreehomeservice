import Link from 'next/link';
import { cn } from '../../lib/utils';

const items = [
  { href: '/customer', label: 'Home' },
  { href: '/customer/bookings', label: 'Bookings' },
  { href: '/customer/chat', label: 'Chat' },
  { href: '/profile', label: 'Profile' }
];

export function MobileNav({ active }: { active?: string }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white md:hidden">
      <div className="grid grid-cols-4">
        {items.map(i => (
          <Link key={i.href} href={i.href} className={cn('py-3 text-center text-sm', active===i.href?'text-primary':'text-secondary')}>
            {i.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
