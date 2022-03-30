import Link from "next/link";
import { useState, useEffect } from "react";
import fetch from "isomorphic-unfetch";
import { Button, Form, Loader } from "semantic-ui-react";
import { useRouter } from "next/router"; //this is a nextjs router

const Logactivity = ({ fakeProp }) => {
  const [form, setForm] = useState({
    activity: "",
    date: "",
    quantity: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (isSubmitting) {
      if (Object.keys(errors).length === 0) {
        createNote(form);
      } else {
        setIsSubmitting(false);
      }
    }
  }, [errors]);

  const createNote = async (data) => {
    console.log(data);
    try {
      // const protocol = req.headers["x-forwarded-proto"] || "http";
      // const baseUrl = req ? `${protocol}://${req.headers.host}` : "";
      const baseUrl = "https://habit-tracker-iota.vercel.app/";

      const res = await fetch(baseUrl + "api/activities", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      // router.push("/"); // goes back to index page
    } catch (error) {
      console.log("error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let errs = validate();
    setErrors(errs);
    setIsSubmitting(true);
  };
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let err = {};
    if (!form.activity) {
      err.activity = "Title is required";
    }
    if (!form.date) {
      err.date = "Date is required";
    }
    if (!form.quantity) {
      err.quantity = "Quantity is required";
    }

    return err;
  };

  return (
    <div className="form-container">
      <h1>Activity Logger</h1>
      <div>
        {isSubmitting ? (
          <Loader active inline="centered" />
        ) : (
          <div>
            <Button
              onClick={() =>
                createNote({
                  activity: "code",
                  date: "2022-03-30",
                  quantity: 1,
                })
              }
            >
              Coded Today
            </Button>
            <Button
              onClick={() =>
                createNote({
                  activity: "code",
                  date: "2022-03-29",
                  quantity: 1,
                })
              }
            >
              Coded Yday
            </Button>
            <Button
              onClick={() =>
                createNote({
                  activity: "lift",
                  date: "2022-03-30",
                  quantity: 1,
                })
              }
            >
              Lifted Today
            </Button>
            <Button
              onClick={() =>
                createNote({
                  activity: "lift",
                  date: "2022-03-29",
                  quantity: 1,
                })
              }
            >
              Lifted Yday
            </Button>
            <Form onSubmit={handleSubmit}>
              <div className="inline-form">
                <Form.Input
                  className="form-input"
                  fluid
                  error={
                    errors.activity
                      ? { content: "Please enter a title", pointing: "above" }
                      : null
                  }
                  // label="Activity"
                  placeholder="activity: code"
                  name="activity"
                  onChange={handleChange}
                  //   id="form-input"
                />
                <Form.Input
                  className="form-input"
                  fluid
                  error={
                    errors.quantity
                      ? {
                          content: "Please enter a quantity",
                          pointing: "above",
                        }
                      : null
                  }
                  // label="quantity"
                  placeholder="quantity: 1 to 3"
                  name="quantity"
                  onChange={handleChange}
                />
                <Form.Input
                  className="form-input"
                  fluid
                  error={
                    errors.date
                      ? {
                          content: "Please enter a description",
                          pointing: "above",
                        }
                      : null
                  }
                  // label="Date"
                  placeholder="date: 1969-04-20"
                  name="date"
                  onChange={handleChange}
                />

                <Button className="button" type="submit">
                  Create
                </Button>
              </div>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logactivity;
