import { Form, Row, Card, Button, Stack, ThemeProvider } from "react-bootstrap";
import CustomField from "./CustomField";
import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

const CustomForm = forwardRef(
  (
    {
      title,
      subTitle,
      fields = [],
      itemsPerRow = 2,
      handleSubmit = () => {},
      data = {},
      showFormByDefault = false,
      customContent
    },
    ref
  ) => {
    const formRef = useRef();
    const [values, setValues] = useState(data);
    const [validated, setValidated] = useState(false);
    const [showForm, setShowForm] = useState(showFormByDefault);
    const onSubmit = useCallback(
      (e) => {
        const form = e.currentTarget;
        setValidated(true);
        console.log("e ==> ", form.elements, form.checkValidity());
        if (form.checkValidity() === true) {
          handleSubmit(values);
        }
        e.preventDefault();
        e.stopPropagation();
      },
      [values, handleSubmit]
    );

    useEffect(() => {
      setValues(prev => ({ ...prev, ...data }));
    }, [data])

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
        console.log(evt.target.value, evt.target.name);
        prev[evt.target.name] = evt.target.value;
        return prev;
      });
    };

    const handleCreateForm = () => {
      setShowForm(true);
    };

    const hanldeCloseForm = () => {
      console.log('formRef ==> ', formRef.current);
      if (formRef.current) {
        formRef.current.reset();
      }
      setValidated(false);
      setValues({...data});
      setShowForm(false);
    };

    return (
      <ThemeProvider>
        <Card className="m-2">
          {showForm ? (
            <Card.Body>
              {title && <Card.Title>{title}</Card.Title>}
              {subTitle && (
                <Card.Subtitle className="mb-2 text-muted">
                  {subTitle}
                </Card.Subtitle>
              )}
              {customContent}
              <Form
                validated={validated}
                onSubmit={onSubmit}
                className="mt-5"
                ref={formRef}
                id={`${title.replace(/ /g, '_')?.toLowerCase() || 'custom_form'}`}
              >
                {fieldsInRows?.map((rowFields, rowIdx) => (
                  <Row
                    className="mb-3"
                    key={`${title || "form_card"}_row_${rowIdx}`}
                  >
                    {rowFields.map((field, fieldIdx) => {
                      const size = Math.floor(12 / itemsPerRow);
                      let widthProp = size > 2 ? { lg: size } : { md: size };
                      widthProp =
                        field.type === "repeat" ? { lg: 12 } : widthProp;
                      return (
                        <CustomField
                          {...widthProp}
                          key={`${"form_"}_field_${rowIdx}_${fieldIdx}_${
                            field.type
                          }_${field.name}`}
                          onChange={handleChange}
                          {...field}
                          value={values[field.name]}
                          ref={(el) => ref?.current?.push(el)}
                        />
                      );
                    })}
                  </Row>
                ))}
                <Stack
                  gap={2}
                  className="justify-content-md-end justify-content-center flex-row"
                >
                  <Button variant="secondary" onClick={hanldeCloseForm}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Stack>
              </Form>
            </Card.Body>
          ) : (
            <Card.Body className="d-flex flex-column">
              <div className="h3 text-muted d-flex justify-content-center mb-3">
                {`No Form is created, do you want to create "${title}" ?`}
              </div>
              <span className="d-flex justify-content-center">
                <Button variant="primary" onClick={handleCreateForm}>
                  Create Form
                </Button>
              </span>
            </Card.Body>
          )}
        </Card>
      </ThemeProvider>
    );
  }
);

export default memo(CustomForm);
