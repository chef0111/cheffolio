'use client';

import { ChevronRight, File, Folder, FolderOpen } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useContext,
  useId,
  useState,
} from 'react';

import { cn } from '@/lib/utils';

type TreeContextType = {
  expandedIds: Set<string>;
  selectedIds: string[];
  toggleExpanded: (nodeId: string) => void;
  handleSelection: (nodeId: string, ctrlKey: boolean) => void;
  showLines?: boolean;
  showIcons?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  indent?: number;
  animateExpand?: boolean;
};

const TreeContext = createContext<TreeContextType | undefined>(undefined);

const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error('Tree components must be used within a TreeProvider');
  }
  return context;
};

type TreeNodeContextType = {
  nodeId: string;
  level: number;
  isLast: boolean;
  parentPath: boolean[];
};

const TreeNodeContext = createContext<TreeNodeContextType | undefined>(
  undefined
);

const useTreeNode = () => {
  const context = useContext(TreeNodeContext);
  if (!context) {
    throw new Error('TreeNode components must be used within a TreeNode');
  }
  return context;
};

export type TreeProviderProps = {
  children: ReactNode;
  defaultExpandedIds?: string[];
  showLines?: boolean;
  showIcons?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  indent?: number;
  animateExpand?: boolean;
  className?: string;
};

export const TreeProvider = ({
  children,
  defaultExpandedIds = [],
  showLines = true,
  showIcons = true,
  selectable = true,
  multiSelect = false,
  selectedIds,
  onSelectionChange,
  indent = 20,
  animateExpand = true,
  className,
}: TreeProviderProps) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(defaultExpandedIds)
  );
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(
    selectedIds ?? []
  );

  const isControlled =
    selectedIds !== undefined && onSelectionChange !== undefined;
  const currentSelectedIds = isControlled ? selectedIds : internalSelectedIds;

  const toggleExpanded = useCallback((nodeId: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  const handleSelection = useCallback(
    (nodeId: string, ctrlKey = false) => {
      if (!selectable) {
        return;
      }

      let newSelection: string[];

      if (multiSelect && ctrlKey) {
        newSelection = currentSelectedIds.includes(nodeId)
          ? currentSelectedIds.filter((id) => id !== nodeId)
          : [...currentSelectedIds, nodeId];
      } else {
        newSelection = currentSelectedIds.includes(nodeId) ? [] : [nodeId];
      }

      if (isControlled) {
        onSelectionChange?.(newSelection);
      } else {
        setInternalSelectedIds(newSelection);
      }
    },
    [
      selectable,
      multiSelect,
      currentSelectedIds,
      isControlled,
      onSelectionChange,
    ]
  );

  return (
    <TreeContext.Provider
      value={{
        expandedIds,
        selectedIds: currentSelectedIds,
        toggleExpanded,
        handleSelection,
        showLines,
        showIcons,
        selectable,
        multiSelect,
        indent,
        animateExpand,
      }}
    >
      <div className={cn('w-full', className)}>{children}</div>
    </TreeContext.Provider>
  );
};

export type TreeViewProps = HTMLAttributes<HTMLDivElement>;

export const TreeView = ({ className, children, ...props }: TreeViewProps) => (
  <div className={cn('w-full p-1.5', className)} role="tree" {...props}>
    {children}
  </div>
);

export type TreeNodeProps = HTMLAttributes<HTMLDivElement> & {
  nodeId?: string;
  level?: number;
  isLast?: boolean;
  parentPath?: boolean[];
  hasChildren?: boolean;
  children?: ReactNode;
};

export const TreeNode = ({
  nodeId: providedNodeId,
  level = 0,
  isLast = false,
  parentPath = [],
  hasChildren = false,
  children,
  className,
  ...props
}: TreeNodeProps) => {
  const generatedId = useId();
  const nodeId = providedNodeId ?? generatedId;
  const { expandedIds, selectedIds } = useTree();
  const isExpanded = expandedIds.has(nodeId);
  const isSelected = selectedIds.includes(nodeId);

  // Build the parent path - mark positions where the parent was the last child
  const currentPath = level === 0 ? [] : [...parentPath];
  if (level > 0 && parentPath.length < level - 1) {
    // Fill in missing levels with false (not last)
    while (currentPath.length < level - 1) {
      currentPath.push(false);
    }
  }
  if (level > 0) {
    currentPath[level - 1] = isLast;
  }

  return (
    <TreeNodeContext.Provider
      value={{
        nodeId,
        level,
        isLast,
        parentPath: currentPath,
      }}
    >
      <div
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        className={cn('w-full min-w-0 select-none', className)}
        role="treeitem"
        {...props}
      >
        {children}
      </div>
    </TreeNodeContext.Provider>
  );
};

export type TreeNodeTriggerProps = ComponentProps<'button'>;

export const TreeNodeTrigger = ({
  children,
  className,
  onClick,
  ...props
}: TreeNodeTriggerProps) => {
  const { selectedIds, toggleExpanded, handleSelection, indent } = useTree();
  const { nodeId, level } = useTreeNode();
  const isSelected = selectedIds.includes(nodeId);

  return (
    <button
      type="button"
      {...props}
      className={cn(
        'group relative flex w-full min-w-0 cursor-pointer items-center rounded-md border-0 bg-transparent py-2 pr-3 text-left transition-colors duration-200',
        'hover:bg-accent/50 active:bg-accent/60',
        isSelected && 'bg-accent/80',
        className
      )}
      onClick={(e) => {
        toggleExpanded(nodeId);
        handleSelection(nodeId, e.ctrlKey || e.metaKey);
        onClick?.(e);
      }}
      style={{
        ...props.style,
        paddingLeft: level * (indent ?? 0) + 8,
      }}
    >
      <TreeLines />
      {children}
    </button>
  );
};

export const TreeLines = () => {
  const { showLines, indent } = useTree();
  const { level, isLast, parentPath } = useTreeNode();

  if (!showLines || level === 0) {
    return null;
  }

  return (
    <span className="pointer-events-none absolute top-0 bottom-0 left-0">
      {/* Render vertical lines for all parent levels */}
      {Array.from({ length: level }, (_, index) => {
        const shouldHideLine = parentPath[index] === true;
        if (shouldHideLine && index === level - 1) {
          return null;
        }

        return (
          <span
            className="border-border/40 absolute top-0 bottom-0 border-l"
            key={index.toString()}
            style={{
              left: index * (indent ?? 0) + 12,
              display: shouldHideLine ? 'none' : 'block',
            }}
          />
        );
      })}

      {/* Horizontal connector line */}
      <span
        className="border-border/40 absolute top-1/2 border-t"
        style={{
          left: (level - 1) * (indent ?? 0) + 12,
          width: (indent ?? 0) - 4,
          transform: 'translateY(-1px)',
        }}
      />

      {/* Vertical line to midpoint for last items */}
      {isLast && (
        <span
          className="border-border/40 absolute top-0 border-l"
          style={{
            left: (level - 1) * (indent ?? 0) + 12,
            height: '50%',
          }}
        />
      )}
    </span>
  );
};

export type TreeNodeContentProps = HTMLAttributes<HTMLDivElement> & {
  hasChildren?: boolean;
};

export const TreeNodeContent = ({
  children,
  hasChildren = false,
  className,
  ...props
}: TreeNodeContentProps) => {
  const { animateExpand, expandedIds } = useTree();
  const { nodeId } = useTreeNode();
  const isExpanded = expandedIds.has(nodeId);

  return (
    <AnimatePresence initial={false}>
      {hasChildren && isExpanded && (
        <motion.div
          animate={{ height: 'auto', opacity: 1 }}
          className="overflow-hidden"
          exit={{ height: 0, opacity: 0 }}
          initial={{ height: 0, opacity: 0 }}
          transition={{
            duration: animateExpand ? 0.3 : 0,
            ease: 'easeInOut',
          }}
        >
          <div
            className={cn('w-full min-w-0', className)}
            role="group"
            {...props}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export type TreeExpanderProps = ComponentProps<typeof motion.span> & {
  hasChildren?: boolean;
};

export const TreeExpander = ({
  hasChildren = false,
  className,
  ...props
}: TreeExpanderProps) => {
  const { expandedIds } = useTree();
  const { nodeId } = useTreeNode();
  const isExpanded = expandedIds.has(nodeId);

  if (!hasChildren) {
    return <span className="mr-1 inline-block h-4 w-4" />;
  }

  return (
    <motion.span
      animate={{ rotate: isExpanded ? 90 : 0 }}
      className={cn(
        'pointer-events-none mr-1 inline-flex h-4 w-4 items-center justify-center',
        className
      )}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      {...props}
    >
      <ChevronRight className="text-muted-foreground h-3 w-3" />
    </motion.span>
  );
};

export type TreeIconProps = ComponentProps<typeof motion.span> & {
  icon?: ReactNode;
  hasChildren?: boolean;
};

export const TreeIcon = ({
  icon,
  hasChildren = false,
  className,
  ...props
}: TreeIconProps) => {
  const { showIcons, expandedIds } = useTree();
  const { nodeId } = useTreeNode();
  const isExpanded = expandedIds.has(nodeId);

  if (!showIcons) {
    return null;
  }

  const getDefaultIcon = () =>
    hasChildren ? (
      isExpanded ? (
        <FolderOpen className="h-4 w-4" />
      ) : (
        <Folder className="h-4 w-4" />
      )
    ) : (
      <File className="h-4 w-4" />
    );

  return (
    <motion.span
      className={cn(
        'text-muted-foreground mr-2 inline-flex h-4 w-4 items-center justify-center',
        className
      )}
      transition={{ duration: 0.15 }}
      whileHover={{ scale: 1.1 }}
      {...props}
    >
      {icon || getDefaultIcon()}
    </motion.span>
  );
};

export type TreeLabelProps = HTMLAttributes<HTMLSpanElement>;

export const TreeLabel = ({ className, ...props }: TreeLabelProps) => (
  <span
    className={cn('min-w-0 flex-1 truncate text-sm', className)}
    {...props}
  />
);
