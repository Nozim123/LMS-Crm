export const getOverview = async (req, res) => {
  res.json({
    tenantId: req.tenantId,
    stats: {
      studentsCount: 0,
      monthlyRevenue: 0,
      attendanceRate: 0,
      teacherPerformance: []
    }
  });
};
