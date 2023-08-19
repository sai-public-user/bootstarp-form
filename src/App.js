import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import CustomForm from "./Components/CustomForm";

const fields = [
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
    label: "Email",
    name: "email",
    type: "email",
    required: true,
  },
  {
    label: "Phone",
    name: "phone",
    type: "tel",
    required: true,
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
  },
  {
    label: "Date Of Birth",
    name: "dob",
    type: "date",
    required: true,
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
  },
  {
    label: "Location",
    name: "location",
    type: "text",
    required: true,
  },{
    label: "Zip Code",
    name: "zip",
    type: "number",
    required: true,
  }
];

function App() {
  return (
    <div className="App">
      <CustomForm
        title="Test Form"
        subTitle="Sample subtitle"
        fields={fields}
        itemsPerRow={1}
        handleSubmit={(data) => alert(JSON.stringify(data))}
      />
    </div>
  );
}

export default App;
