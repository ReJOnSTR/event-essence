
import React from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarEvent } from '@/types/calendar';

interface DragDropContainerProps {
  children: React.ReactNode;
  onDragEnd: (result: DropResult) => void;
  activeEvent?: CalendarEvent | null;
  isDragging?: boolean;
}

export default function DragDropContainer({
  children,
  onDragEnd,
  activeEvent,
  isDragging
}: DragDropContainerProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="relative">
        {/* Dynamic drag overlay */}
        <AnimatePresence>
          {isDragging && activeEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-accent/10 pointer-events-none z-10"
            />
          )}
        </AnimatePresence>
        {children}
      </div>
    </DragDropContext>
  );
}
