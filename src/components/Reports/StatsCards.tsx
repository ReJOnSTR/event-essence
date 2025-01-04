import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student, Lesson } from "@/types/calendar";
import { useCalculatePeriodStats } from "@/utils/reportCalculations";
import { motion } from "framer-motion";

interface StatsCardsProps {
  lessons: Lesson[];
  students: Student[];
  selectedDate: Date;
  selectedStudent: string;
  startDate?: Date;
  endDate?: Date;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: "easeOut"
    }
  })
};

export function StatsCards({
  lessons,
  students,
  selectedDate,
  selectedStudent,
  startDate,
  endDate,
}: StatsCardsProps) {
  const { hours, earnings } = useCalculatePeriodStats(
    lessons,
    selectedDate,
    selectedStudent,
    students,
    startDate,
    endDate
  );

  const formatCurrency = (value: number) => {
    return value.toLocaleString('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    });
  };

  const stats = [
    { title: "Bu Hafta", hours: hours.weekly, earnings: earnings.weekly },
    { title: "Bu Ay", hours: hours.monthly, earnings: earnings.monthly },
    { title: "Bu Yıl", hours: hours.yearly, earnings: earnings.yearly },
    { title: "Seçili Dönem", hours: hours.custom, earnings: earnings.custom }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="text-2xl font-bold"
              >
                {stat.hours} Saat
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-xs text-muted-foreground mt-1"
              >
                {formatCurrency(stat.earnings)}
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}