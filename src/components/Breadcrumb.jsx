import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({ items, onNavigate }) {
  return (
    <nav aria-label="Breadcrumb" className="py-4 text-xs font-sans text-stone-500 uppercase tracking-widest">
      <ol className="flex items-center flex-wrap gap-2">
        <li className="flex items-center gap-1.5">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 hover:text-stone-900 transition-colors"
          >
            <Home className="w-3 h-3 text-stone-400" />
            <span>Home</span>
          </button>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-stone-300" />
              {isLast || !item.view ? (
                <span className="text-stone-900 font-medium truncate max-w-[200px] md:max-w-none">
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => onNavigate(item.view, item.param)}
                  className="hover:text-stone-900 transition-colors truncate max-w-[150px] md:max-w-none"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
