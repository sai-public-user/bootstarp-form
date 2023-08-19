import { forwardRef, useMemo } from "react";
import { Form, Col, Stack } from "react-bootstrap";

const CustomField = forwardRef(({
  xs,
  sm,
  md,
  lg,
  xl,
  onChange,
  labelProps,
  type,
  ...props
}, ref) => {
  const formControl = useMemo(() => {
    switch (type) {
      case 'switch':
      case "checkbox":
      case "radio": {
        return (
          <Stack className="flex-row">
            {props?.options?.map((opt, optIdx) => (
              <Form.Check
                inline
                label={opt.label}
                name={props.name}
                type={type}
                value={opt.value}
                id={`inline-${type}-${props.name}-${optIdx}`}
                key={`inline-${type}-${props.name}-${optIdx}`}
                onChange={onChange}
              />
            ))}
          </Stack>
        );
      }
      case "select": {
        return (
          <Form.Select onChange={onChange} {...props} ref={ref}>
            <option disabled>Select Option</option>
            {props?.options?.map((opt, optIdx) => (
              <option key={`${opt.value}_${optIdx}`} value={opt.value}>
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
        return <Form.Control ref={ref} onChange={onChange} type={type} {...props} />;
    }
  }, [onChange, props, type, ref]);
  const showLabel = useMemo(() => {
    const inlineTypes = ["radio, checkbox", "switch"];
    return !inlineTypes.includes(type) && props.label;
  }, [type, props.label]);
  return (
    <Form.Group as={Col} md={md} lg={lg} sm={sm} xs={xs} xl={xl} controlId={props.name}>
      {showLabel && <Form.Label className="h6" {...labelProps}>{props.label}</Form.Label>}
      {formControl}
      <Form.Control.Feedback
        as="div"
        tooltip
        type={props.valid ? "valid" : "invalid"}
      >
        {`Please enter proper ${props.label}`}
      </Form.Control.Feedback>
    </Form.Group>
  );
})


export default CustomField;