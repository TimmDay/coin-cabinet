# Shared Edit View Architecture

This document explains how to use the new shared components for admin edit views to reduce code duplication and maintain consistency.

## Components Overview

### GenericEditView

A reusable component that handles the common patterns across all edit views:

- Filtering and search functionality
- Loading states
- Empty states
- List item rendering
- Modal management integration
- Success/error message display
- Optional "Add New" functionality

**Location:** `~/components/admin/GenericEditView.tsx`

### useEditModal Hook

A custom hook that manages modal state and common handlers:

- Modal open/close state
- Selected item tracking
- Success message handling with auto-timeout
- Consistent handler patterns

**Location:** `~/hooks/useEditModal.ts`

## Usage Pattern

### 1. Import Required Dependencies

```tsx
import { GenericEditView } from "~/components/admin/GenericEditView"
import { useEditModal } from "~/hooks/useEditModal"
import { useYourDataQuery, useYourUpdateMutation } from "~/api/your-api"
import type { YourDataType } from "~/database/your-schema"
import { YourEditModal } from "./YourEditModal"
```

### 2. Set Up Data and Modal Management

```tsx
export function EditYourDataView() {
  const dataQuery = useYourDataQuery()
  const updateMutation = useYourUpdateMutation()

  const {
    message,
    selectedItemId,
    isModalOpen,
    handleItemSelect,
    handleModalClose,
    handleSuccess,
  } = useEditModal<YourDataType>()
```

### 3. Define Filter Logic

```tsx
const filterFunction = (item: YourDataType, filterTerm: string) =>
  item.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
  // Add other searchable fields
  item.otherField?.toLowerCase().includes(filterTerm.toLowerCase())
```

### 4. Define List Item Rendering

```tsx
const renderListItem = (item: YourDataType) => (
  <div>
    <h3 className="font-medium text-white">{item.name}</h3>
    <p className="text-sm text-gray-400">{item.description}</p>
  </div>
)
```

### 5. Define Modal Rendering

```tsx
const renderModal = (selectedItem: YourDataType | null) => {
  return selectedItem ? (
    <YourEditModal
      key={`item-${selectedItem.id}-${selectedItem.updated_at}`}
      isOpen={isModalOpen}
      onClose={handleModalClose}
      item={selectedItem}
      onSuccess={handleSuccess}
      isSaving={updateMutation.isPending}
    />
  ) : null
}
```

### 6. Use GenericEditView

```tsx
  return (
    <GenericEditView
      dataQuery={dataQuery}
      cardClass="artemis-card" // or "somnus-card"
      itemColorScheme="slate" // or "gray"
      filterLabel="Filter by Name"
      filterPlaceholder="Search items..."
      filterFunction={filterFunction}
      renderListItem={renderListItem}
      selectedItemId={selectedItemId}
      onItemSelect={handleItemSelect}
      renderModal={renderModal}
      addNewConfig={{
        label: "Add New Item",
        href: "/admin/add-item",
      }}
      emptyStateConfig={{
        title: "No Items Yet",
        description: "Start by adding your first item.",
        showAddButton: true,
      }}
      message={message}
      onSuccess={handleSuccess}
    />
  )
}
```

## Configuration Options

### CardClass

- `"artemis-card"`: Standard card styling (default)
- `"somnus-card"`: Alternative card styling for specific sections

### ItemColorScheme

- `"gray"`: Light theme with white backgrounds (default)
- `"slate"`: Dark theme with slate-800 backgrounds

### AddNewConfig (Optional)

```tsx
addNewConfig={{
  label: "Add New Item",
  href: "/admin/add-item",
}}
```

### EmptyStateConfig

```tsx
emptyStateConfig={{
  title: "No Items Yet",
  description: "Items will appear here once added.",
  showAddButton: false, // Whether to show "Add New" in empty state
}}
```

## Examples

### Basic Implementation (Historical Figures)

```tsx
<GenericEditView
  dataQuery={dataQuery}
  cardClass="artemis-card"
  itemColorScheme="slate"
  filterLabel="Filter by Name, Authority, or Dynasty"
  filterPlaceholder="Search by name, authority, dynasty..."
  filterFunction={filterFunction}
  renderListItem={renderListItem}
  selectedItemId={selectedItemId}
  onItemSelect={handleItemSelect}
  renderModal={renderModal}
  emptyStateConfig={{
    title: "No Historical Figures Found",
    description: "No historical figures have been created yet.",
    showAddButton: false,
  }}
  message={message}
  onSuccess={handleSuccess}
/>
```

### With Add New Button (Mints)

```tsx
<GenericEditView
  dataQuery={dataQuery}
  cardClass="artemis-card"
  itemColorScheme="slate"
  filterLabel="Filter by Name, Location, or Mint Marks"
  filterPlaceholder="Search by name, location, or mint marks..."
  filterFunction={filterFunction}
  renderListItem={renderListItem}
  selectedItemId={selectedItemId}
  onItemSelect={handleItemSelect}
  renderModal={renderModal}
  addNewConfig={{
    label: "Add New Mint",
    href: "/admin/add-mint",
  }}
  emptyStateConfig={{
    title: "No Mints Yet",
    description: "Start by adding your first mint location.",
    showAddButton: true,
  }}
  message={message}
  onSuccess={handleSuccess}
/>
```

## Migration Guide

To migrate an existing edit view:

1. Replace manual state management with `useEditModal` hook
2. Extract filter logic into a `filterFunction`
3. Extract list item rendering into a `renderListItem` function
4. Extract modal rendering into a `renderModal` function
5. Replace the entire JSX with `GenericEditView` component
6. Configure styling and behavior with props

## Benefits

- **Reduced Code Duplication**: ~150 lines per edit view reduced to ~50 lines
- **Consistent UX**: All edit views behave the same way
- **Easier Maintenance**: Changes to common behavior only need to be made once
- **Type Safety**: Full TypeScript support with generics
- **Flexibility**: Customizable while maintaining consistency

## File Structure

```
src/
├── components/admin/
│   └── GenericEditView.tsx
├── hooks/
│   └── useEditModal.ts
└── app/admin/
    ├── edit-historical-figures/
    │   └── EditHistoricalFiguresView.tsx
    ├── edit-mints/
    │   └── EditMintsView.tsx
    └── [other-edit-views]/
        └── EditView.tsx
```
