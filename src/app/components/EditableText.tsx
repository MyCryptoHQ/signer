import React, { useEffect, useState } from 'react';

import edit from '@assets/icons/edit.svg';

import { Box, BoxProps, Image, Input } from '.';
import { Body } from './Typography';

export const EditableText = ({
  value,
  onChange,
  placeholder,
  ...props
}: { value: string; placeholder?: string; onChange(value: string): void } & Omit<
  BoxProps,
  'onChange'
>) => {
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');

  const handleKeyDown = ({ key }: { key: string }) => {
    if (key === 'Escape') {
      handleCancel();
    } else if (key === 'Enter') {
      handleSave();
    }
  };

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditValue(value);
  };

  const handleSave = () => {
    onChange(editValue);
    setEditMode(false);
  };

  const hasValue = value !== undefined;

  return (
    <Box variant="rowAlign" height="100%" {...props}>
      {editMode ? (
        <Input
          placeholder={placeholder}
          autoFocus={true}
          value={editValue}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          onChange={(e) => setEditValue(e.currentTarget.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          sx={{ width: 'auto' }}
        />
      ) : (
        <>
          <Body as="span" onClick={handleEdit}>
            {hasValue ? value : placeholder}
          </Body>
          <Image src={edit} onClick={handleEdit} ml="2" height="16px" width="16px" />
        </>
      )}
    </Box>
  );
};
