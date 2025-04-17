// Đây là file giả lập cho Chart.js
// Chúng ta cần tạo các export tương ứng với những phần được import trong Dashboard.tsx

export const Chart = {};
export const CategoryScale = {};
export const LinearScale = {};
export const PointElement = {};
export const LineElement = {};
export const BarElement = {};
export const Title = {};
export const Tooltip = {};
export const Legend = {};
export const ArcElement = {};

Chart.register = function() {
  console.log('Chart.js register called with mock implementation');
};

// Xuất các module mặc định
export default {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
}; 