import { forwardRef, memo, useMemo } from "react";
import { Form, Col, Stack } from "react-bootstrap";
import IncrementalFields from "./IncrementalFields";
import CustomTable from "./CustomTable";

const CustomField = forwardRef(
  (
    { xs, sm, md, lg, xl, onChange, labelProps, type, value, ...props },
    ref
  ) => {
    const formControl = useMemo(() => {
      switch (type) {
        case "table": {
          return <CustomTable {...props} onChange={onChange} ref={ref} />
        }
        case "repeat": {
          return <IncrementalFields {...props} onChange={onChange} ref={ref} />;
        }
        case "switch":
        case "checkbox":
        case "radio": {
          return (
            <Stack className="flex-row">
              {props?.options?.map((opt, optIdx) => (
                <Form.Check
                  inline
                  label={opt.label}
                  name={props.name}
                  checked={props.name === value}
                  type={type}
                  value={opt.value}
                  ref={(el) => ref?.current?.push(el)}
                  id={`inline-${type}-${props.name}-${optIdx}`}
                  key={`inline-${type}-${props.name}-${optIdx}-${opt.label}`}
                  onChange={onChange}
                />
              ))}
            </Stack>
          );
        }
        case "select": {
          return (
            <Form.Select
              onChange={onChange}
              {...props}
              ref={(el) => ref?.current?.push(el)}
              value={value}
            >
              <option disabled>Select Option</option>
              {props?.options?.map((opt, optIdx) => (
                <option
                  key={`${opt.value}_${optIdx}_${opt.label}`}
                  value={opt.value}
                >
                  {opt.label}
                </option>
              ))}
            </Form.Select>
          );
        }
        case "file":
        case "tel":
        case "date":
        case "number":
        case "email":
        case "text":
        default:
          return (
            <Form.Control
              ref={(el) => ref?.current?.push(el)}
              onChange={onChange}
              type={type}
              value={value}
              {...props}
            />
          );
      }
    }, [onChange, props, type, ref, value]);
    const showLabel = useMemo(() => {
      const typesWithoutLabel = [];
      return !typesWithoutLabel.includes(type) && props.label;
    }, [type, props.label]);
    return (
      <Form.Group
        as={Col}
        md={md}
        lg={lg}
        sm={sm}
        xs={xs}
        xl={xl}
        controlId={props.name}
      >
        {["table", "repeat"].includes(type) ? (
          <>
            {showLabel && (
              <Form.Label className="h6" {...labelProps}>
                {props.label}
              </Form.Label>
            )}
            {formControl}
          </>
        ) : (
          <Stack className="flex-row row">
            {showLabel && (
              <Col md={3} sm={12}>
                <Form.Label className="h6" {...labelProps}>
                  {props.label}
                </Form.Label>
              </Col>
            )}
            <Col md={9} sm={12}>
              {formControl}
            </Col>
          </Stack>
        )}
        <Form.Control.Feedback
          as="div"
          tooltip
          type={props.valid ? "valid" : "invalid"}
        >
          {`Please enter proper ${props.label}`}
        </Form.Control.Feedback>
      </Form.Group>
    );
  }
);

export default memo(CustomField);
