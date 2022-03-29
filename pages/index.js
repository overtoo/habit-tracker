import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/activities";
import Link from "next/link";
import Date from "../components/date";
import Calendar from "react-github-contribution-calendar";
import LogActivity from "../components/logactivity";
import { Button, Form, Loader } from "semantic-ui-react";

export default function Home({ allPostsData }) {
  const values = {};
  const until = "2022-03-31";
  const types = ["code", "lift"];

  const deleteAll = async () => {
    await Promise.all(
      allPostsData.map(async (item) => {
        try {
          const deleted = await fetch(`api/activities/${item._id}`, {
            method: "Delete",
          });
        } catch (error) {
          console.log(error);
        }
      })
    );
  };

  types.map(
    (type) =>
      (values[type] = Object.assign(
        {},
        ...allPostsData.map((x) =>
          x.activity == type
            ? {
                [x.date]: allPostsData
                  .filter((i) => i.date === x.date)
                  .reduce((a, b) => ({
                    quantity: parseInt(a.quantity) + parseInt(b.quantity),
                  })).quantity,
              }
            : null
        )
      ))
  );

  // var values2 = {
  //   "2022-01-23": 1,
  //   "2022-01-26": 2,
  //   "2022-01-27": 3,
  //   "2022-01-28": 4,
  //   "2021-06-29": 4,
  // };
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      {/* <section className={utilStyles.headingMd}>
        <p>[Your Self Introduction]</p>
      </section> */}
      <section>
        <h2 className={utilStyles.headingLg}>Code</h2>
        <Calendar values={values.code} until={until} />
        <h2 className={utilStyles.headingLg}>Lift</h2>
        <Calendar values={values.lift} until={until} />
        <LogActivity /> <Button onClick={() => deleteAll()}> reset all </Button>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Log</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, activity, quantity }) => (
            <li className={utilStyles.listItem} key={id}>
              {/* <Link href={`/posts/${id}`}>
                <a>{activity}</a>
              </Link>{" "} */}
              <small className={utilStyles.lightText}>
                {activity} -- {quantity} --
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>{" "}
      {JSON.stringify(values)}{" "}
    </Layout>
  );
}

// Index.getInitialProps = async () => {
//   const baseUrl = "http://localhost:3000/";
//   const res = await fetch(baseUrl + "/api/notes");
//   const { data } = await res.json();

//   return { notes: data };
// };

export async function getStaticProps() {
  const baseUrl = "http://localhost:3000/";
  const res = await fetch(baseUrl + "/api/activities");
  const { data } = await res.json();

  return {
    props: {
      allPostsData: data,
    },
  };
}
