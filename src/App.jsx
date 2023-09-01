import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import CustomForm from "./Components/CustomForm";
import { Button, Col, Form, InputGroup, Row, Stack } from "react-bootstrap";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";
import TestData from "./metadata.json";
import CustomField from "./Components/CustomField";
import CustomModal from "./Components/CustomModal";

function App() {
  const [search, setSearch] = useState();
  const [data] = useState({});
  const [showModal, setShowModal] = useState(null);
  const [currData, setCurrData] = useState({});
  const [currIndex, setCurrIndex] = useState(null);
  const [metaData, setMetaData] = useState(TestData);

  const onDeleteRow = (index) => {
    setMetaData(prev => {
      prev.splice(index, 1);
      return [...prev];
    })
   };

  const onEditRow = (index, row) => {
    setCurrData({ ...row });
    setCurrIndex(index);
    setShowModal("Edit");
  };

  const handleAddRow = () => {
    setShowModal("Add");
  }

  const rowActions = useCallback((row, index) => {
    return (
      <Stack className="flex-row justify-content-center" gap={2}>
        <Button
          title="Edit Row"
          variant="primary"
          size="sm"
          onClick={() => onEditRow(index, row)}
        >
          <PencilIcon width={18} />
        </Button>
        {row.isNewRow && (
          <Button
            title="Delete Row"
            variant="secondary"
            size="sm"
            onClick={() => onDeleteRow(index)}
          >
            <TrashIcon width={18} />
          </Button>
        )}
      </Stack>
    );
  }, []);

  const fields = [
    {
      label: "First Name",
      name: "firstName",
      type: "text",
      required: true,
      showIn: ["create", "update"],
    },
    {
      label: "Last Name",
      name: "lastName",
      type: "text",
      required: true,
      showIn: ["create", "update"],
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      required: true,
      showIn: ["create", "update"],
    },
    {
      label: "Phone",
      name: "phone",
      type: "tel",
      required: true,
      showIn: ["create", "update"],
    },
    {
      label: "Gender",
      name: "gender",
      type: "radio",
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Other", value: "other" },
      ],
      required: true,
      showIn: ["create", "update"],
    },
    {
      label: "Date Of Birth",
      name: "dob",
      type: "date",
      required: true,
      showIn: ["create", "update"],
    },
    {
      label: "Languages",
      name: "lang",
      type: "checkbox",
      options: [
        { label: "English", value: "eng" },
        { label: "Telegu", value: "tel" },
        { label: "Hindi", value: "hin" },
      ],
      required: true,
      showIn: ["create", "update"],
    },
    {
      label: "Country",
      name: "country",
      type: "select",
      options: [
        { label: "United States", value: "US" },
        { label: "India", value: "IN" },
        { label: "Canada", value: "CN" },
      ],
      required: true,
      showIn: ["create", "update"],
    },
    {
      label: "Location",
      name: "location",
      type: "text",
      required: true,
      showIn: ["create", "update"],
    },
    {
      label: "Zip Code",
      name: "zip",
      type: "number",
      required: true,
      showIn: ["create", "update"],
    },
    {
      label: "Meta Data",
      name: "metaData",
      type: "repeat",
      required: true,
      max: 5,
      hasDelete: true,
      showIn: ["create"],
      fields: [
        {
          label: "First Name",
          name: "firstName",
          type: "text",
          required: true,
        },
        {
          label: "Last Name",
          name: "lastName",
          type: "text",
          required: true,
        },
        {
          label: "Marital Status",
          name: "maritalStatus",
          type: "switch",
          options: [
            { label: "Married", value: "married" },
            { label: "Single", value: "single" },
            { label: "Divorced", value: "divorced" },
          ],
        },
      ],
    },
    {
      label: "Meta Data",
      name: "metaData",
      type: "table",
      rowsPerPage: 25,
      rows: metaData,
      showIndex: true,
      rowClass: "test",
      responsive: true,
      striped: true,
      bordered: true,
      hover: true,
      editable: true,
      pagination: "default",
      title: "Meta Data",
      hasTableActions: true,
      tableActionProps: {
        onAddRow: handleAddRow,
      },
      showIn: ["update"],
      columns: [
        { name: "FieldCode", label: "FieldCode", showInExcel: true },
        { name: "FieldValue", label: "FieldValue", showInExcel: true },
        {
          name: "Actions",
          label: "Actoins",
          renderRow: (_, row, idx) => rowActions(row, idx),
        },
      ],
    },
  ];

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      // make the api call here in .then do setData(response.data) or something similar
      console.log("enter press here! ", event.target.value);
      return;
    }
  };

  const getCustomContent = () => {
    return (
      <Row className="justify-content-center justify-content-lg-end mt-4">
        <Col md={12} lg={3}>
          <InputGroup>
            <Form.Control
              type="search"
              value={search}
              id="search"
              placeholder="Search"
              onChange={handleChange}
              onKeyDown={handleSearch}
            />
            <InputGroup.Text id="search">
              <MagnifyingGlassIcon width="30" />
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>
    );
  };

  const handleCurrValChange = (e) => {
    setCurrData((prev) => {
      prev[e.target.name] = e.target.value;
      return {...prev};
    });
  };

  const onModalClose = () => {
    setCurrData({});
    setCurrIndex(null);
    setShowModal(null);
  }

  const onModalSave = useCallback(() => {
    if (currIndex) {
      setMetaData(prev => {
        prev[currIndex] = { ...currData, modified: true };
        return [...prev];
      });
    } else {
      setMetaData(prev => {
        return [{ ...currData, isNewRow: true }, ...prev];
      });
    }
    onModalClose();
  }, [currData, currIndex]);

  return (
    <div className="App">
      <CustomForm
        title="Student Inauguration Form"
        subTitle="Studen form to gather data for student Inauguration and future procedures"
        fields={fields}
        itemsPerRow={2}
        handleSubmit={(data) => alert(JSON.stringify(data))}
        customContent={getCustomContent()}
        data={data}
      />
      <CustomModal
        title={`${showModal} Data`}
        show={showModal}
        onClose={onModalClose}
        onSave={onModalSave}
      >
        <Form>
          <Stack className="mb-3" gap={3}>
            <CustomField
              md={12}
              onChange={handleCurrValChange}
              label="Field Code"
              name="FieldCode"
              type="text"
              value={currData['FieldCode']}
              required
            />
            <CustomField
              md={12}
              onChange={handleCurrValChange}
              label="Field Value"
              name="FieldValue"
              type="text"
              value={currData['FieldValue']}
              required
            />
          </Stack>
        </Form>
      </CustomModal>
    </div>
  );
}

export default App;
