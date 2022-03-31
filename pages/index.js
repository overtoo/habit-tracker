import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
// import { getSortedPostsData } from "../lib/activities";
import Link from "next/link";
import Date from "../components/date";
import Calendar from "react-github-contribution-calendar";
import Logactivity from "../components/logactivity";
import { Button, Form, Loader } from "semantic-ui-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router"; //this is a nextjs router
// import MyCalendar from "../components/calendar";
import dbConnect from "../utils/dbConnect";
import Activity from "../models/Activity";

// function useAuthentication(data) {
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const refreshData = () => {
//     const router = useRouter();

//     router.replace(router.asPath);
//     setIsRefreshing(true);
//   };
//   useEffect(() => {
//     setIsRefreshing(false);
//   }, [data]);
// }

function useAuthentication(data) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshData = () => {
    const router = useRouter();

    router.replace(router.asPath);
    setIsRefreshing(true);
  };
  useEffect(() => {
    setIsRefreshing(false);
  }, [data]);
}

const Home = ({ data }) => {
  console.log(data);

  const refreshData = useAuthentication;

  const hardCoded = [
    {
      _id: "62435a0c351eab2f66e7ad03",
      activity: "code",
      date: "2022-01-29",
      quantity: 1,
      __v: 0,
    },
    {
      _id: "6243e11e137ccbed50900c1e",
      activity: "code",
      date: "2022-01-30",
      quantity: 1,
      __v: 0,
    },
    {
      _id: "6243e11e137ccbed50900c20",
      activity: "code",
      date: "2022-01-29",
      quantity: 1,
      __v: 0,
    },
    {
      _id: "6243e11f137ccbed50900c22",
      activity: "code",
      date: "2022-03-29",
      quantity: 1,
      __v: 0,
    },
    {
      _id: "6243e11f137ccbed50900c24",
      activity: "lift",
      date: "2022-03-30",
      quantity: 1,
      __v: 0,
    },
  ];

  // const router = useRouter();
  // if (router.isFallback) return null;

  const allPostsData = data;

  const values = {};
  const until = "2022-03-31";
  const types = ["code", "lift"];

  console.log(JSON.stringify(allPostsData));

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
    // useAuthentication();
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
        <Logactivity refreshData={refreshData(data)} />
        <Button onClick={() => deleteAll()}> reset all </Button>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Log</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ _id, date, activity, quantity }) => (
            <li className={utilStyles.listItem} key={_id}>
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
};

// export async function getStaticProps() {
//   const baseUrl = "https://habit-tracker-iota.vercel.app/";
//   const res = await fetch(baseUrl + "/api/activities");
//   const { data } = await res.json();

//   return {
//     props: {
//       allPostsData: data,
//     },
//   };
// }

export async function getServerSideProps(req, res) {
  dbConnect();
  const { method } = req;
  const activities = await Activity.find({});
  console.log(activities);

  return {
    props: {
      data: JSON.parse(JSON.stringify(activities)),
    },
  };
}

export default Home;
