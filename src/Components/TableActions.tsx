import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import React, { useCallback, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Stack } from "react-bootstrap";

interface TableActionsProps {
  hasSearch: boolean;
  hasAddRow: boolean;
  hasDownload: boolean;
  onAddRow?: () => void;
  onDownload?: () => void;
  onSearch?: (search: String) => void;
}

export default function TableActions({
  onSearch,
  hasAddRow,
  hasSearch,
  hasDownload,
  onDownload,
  onAddRow,
}: TableActionsProps) {
  const [search, setSearch] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && onSearch) {
        onSearch(search);
      }
    },
    [search, onSearch]
  );
  return (
    <Stack className="flex-row" gap={2}>
      {hasSearch && (
        <InputGroup>
          <Form.Control
            type="search"
            value={search}
            id="table-search"
            placeholder="Search"
            onChange={handleChange}
            onKeyDown={handleSearch}
          />
          <InputGroup.Text
            id="search"
            onClick={() => onSearch && onSearch(search)}
          >
            <MagnifyingGlassIcon width="30" />
          </InputGroup.Text>
        </InputGroup>
      )}
      {hasDownload && (
        <Button
          title="Download"
          variant="primary"
          size="sm"
          onClick={onDownload}
        >
          <ArrowDownTrayIcon width={18} />
        </Button>
      )}
      {hasAddRow && (
        <Button title="Add Row" variant="primary" size="sm" onClick={onAddRow}>
          <PlusIcon width={18} />
        </Button>
      )}
    </Stack>
  );
}
