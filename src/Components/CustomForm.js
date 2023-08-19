import { Form, Row, Card, Button, Stack, ThemeProvider } from "react-bootstrap";
import CustomField from "./CustomField";
import { forwardRef, useCallback, useMemo, useState } from "react";

const CustomForm = forwardRef(
  (
    { title, subTitle, fields = [], itemsPerRow = 2, handleSubmit = () => {} },
    ref
  ) => {
    const [values, setValues] = useState({});
    const [validated, setValidated] = useState(false);
    const onSubmit = useCallback((e) => {
      const form = e.currentTarget;
      setValidated(true);
      console.log("e ==> ", form.elements, form.checkValidity());
      if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        handleSubmit(values);
      }
    }, [values, handleSubmit]);

    const fieldsInRows = useMemo(() => {
      if (Array.isArray(fields) && fields.length) {
        return fields.reduce((acc, field, index) => {
          let len = acc.length - 1;
          if (index % itemsPerRow === 0) {
            acc.push([field]);
            len += 1;
          } else {
            acc[len].push(field);
          }
          return acc;
        }, []);
      }
      return [];
    }, [fields, itemsPerRow]);

    const handleChange = (evt) => {
      setValues((prev) => {
        console.log(evt.target.value)
        prev[evt.target.name] = evt.target.value;
        return prev;
      });
    };

    return (
      <ThemeProvider>
        <Card className="m-2">
          <Card.Body>
            {title && <Card.Title>{title}</Card.Title>}
            {subTitle && (
              <Card.Subtitle className="mb-2 text-muted">
                {subTitle}
              </Card.Subtitle>
            )}
            <Form
              validated={validated}
              onSubmit={onSubmit}
              className="mt-5"
              ref={ref}
            >
              {fieldsInRows?.map((rowFields, rowIdx) => (
                <Row
                  className="mb-3"
                  key={`${title || "form_card"}_row_${rowIdx}`}
                >
                  {rowFields.map((field, fieldIdx) => {
                    const size = Math.floor(12 / itemsPerRow);
                    const widthProp = size > 2 ? { lg: size } : { md: size };
                    return (
                    <CustomField
                      {...widthProp}
                      key={`${
                        title || "form_card"
                      }_field_${rowIdx}_${fieldIdx}`}
                      onChange={handleChange}
                      {...field}
                    />
                  )})}
                </Row>
              ))}
              <Stack
                gap={2}
                className="justify-content-md-end justify-content-center flex-row"
              >
                <Button variant="secondary">Clear</Button>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Stack>
            </Form>
          </Card.Body>
        </Card>
      </ThemeProvider>
    );
  }
);

export default CustomForm;
