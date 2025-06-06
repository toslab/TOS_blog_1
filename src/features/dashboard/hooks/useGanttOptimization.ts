import { useCallback, useEffect, useRef } from 'react';
import { Task } from 'gantt-task-react';
import { debounce } from 'lodash';

export function useGanttOptimization(
  tasks: Task[],
  onUpdate: (task: Task) => void
) {
  const updateQueue = useRef<Map<string, Task>>(new Map());
  const isProcessing = useRef(false);

  // 배치 업데이트 처리
  const processQueue = useCallback(async () => {
    if (isProcessing.current || updateQueue.current.size === 0) return;
    
    isProcessing.current = true;
    const updates = Array.from(updateQueue.current.values());
    updateQueue.current.clear();

    try {
      // 배치로 업데이트 처리
      await Promise.all(updates.map(task => onUpdate(task)));
    } finally {
      isProcessing.current = false;
    }
  }, [onUpdate]);

  // 디바운스된 업데이트
  const debouncedUpdate = useRef(
    debounce((task: Task) => {
      updateQueue.current.set(task.id, task);
      processQueue();
    }, 500)
  ).current;

  // 클린업
  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  return {
    optimizedUpdate: debouncedUpdate,
  };
}