import dbConnect from "../../../utils/dbConnect";
import Activity from "../../../models/Activity";

dbConnect();

export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const activity = await Activity.findById(id);

        if (!activity) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: activity });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const activity = await Activity.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!activity) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: activity });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        const deletedactivity = await Activity.deleteOne({ _id: id });

        if (!deletedactivity) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        return res.status(400).json({ success: false });
      }
      break;
    default:
      return res.status(400).json({ success: false });
      break;
  }
};
