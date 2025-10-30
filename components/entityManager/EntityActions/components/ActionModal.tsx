import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ComponentType<{ item: unknown; onClose: () => void }>;
  footer?: React.ReactNode | ((item: unknown) => React.ReactNode);
  width?: string | number;
  item: unknown;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onClose,
  title,
  content: ContentComponent,
  footer,
  width = 520,
  item,
}) => {
  const renderFooter = () => {
    if (!footer) {
      return (
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      );
    }

    if (typeof footer === 'function') {
      return <DialogFooter>{footer(item)}</DialogFooter>;
    }

    return <DialogFooter>{footer}</DialogFooter>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "max-w-none",
          // Responsive width classes
          "w-full sm:w-auto",
          // Ensure proper centering on mobile
          "max-h-[90vh] overflow-y-auto"
        )}
        style={{
          // Fallback width for larger screens
          width: typeof width === 'number' ? `${Math.min(width, window.innerWidth - 32)}px` : width,
          maxWidth: 'calc(100vw - 2rem)'
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <ContentComponent item={item} onClose={onClose} />
        </div>
        {renderFooter()}
      </DialogContent>
    </Dialog>
  );
};