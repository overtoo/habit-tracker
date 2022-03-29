import dbConnect from "../../../utils/dbConnect";
import Activity from "../../../models/Activity";

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const activities = await Activity.find({});

        res.status(200).json({ success: true, data: activities });
      } catch (error) {
        res.status(400).json({ successs: false });
      }
      break;
    case "POST":
      try {
        const activity = await Activity.create(req.body);

        res.status(201).json({ success: true, data: activity });
      } catch (error) {
        res.status(400).json({ successs: false });
      }
      break;
    default:
      res.status(400).json({ successs: false });
      break;
  }
};
