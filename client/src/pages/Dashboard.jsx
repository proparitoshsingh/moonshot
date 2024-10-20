import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import FilterSection from '../components/FilterSection';
import ChartSection from '../components/ChartSection';

Chart.register(...registerables);
Chart.register(zoomPlugin);

const Dashboard = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const queryParams = new URLSearchParams(location.search);
   const initialAgeGroup = queryParams.get('ageGroup') || 'Age';
   const initialGender = queryParams.get('gender') || 'Gender';
   const initialCategory = queryParams.get('category') || null;

   const [dateRange, setDateRange] = useState([
      {
         startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
         endDate: new Date(),
         key: 'selection',
      },
   ]);

   const [ageGroup, setAgeGroup] = useState(initialAgeGroup);
   const [gender, setGender] = useState(initialGender);
   const [barChartData, setBarChartData] = useState({ labels: [], datasets: [] });
   const [lineChartData, setLineChartData] = useState(null);
   const [selectedCategory, setSelectedCategory] = useState(initialCategory);
   const [showDatePicker, setShowDatePicker] = useState(false);
   const [ageDropdownOpen, setAgeDropdownOpen] = useState(false);
   const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
   const [isInitialLoad, setIsInitialLoad] = useState(true);

   const updateUrlParams = (filters) => {
      const validFilters = Object.fromEntries(
         Object.entries(filters).filter(([key, value]) => value !== null && value !== undefined)
      );
      const queryParams = new URLSearchParams(validFilters).toString();
      navigate(`${location.pathname}?${queryParams}`, { replace: true });
   };

   const fetchData = async (filters = {}) => {
      try {
         const response = await axios.get('http://localhost:3000/api/data', { params: filters, withCredentials: true });
         return response.data;
      } catch (error) {
         console.error('Error fetching data:', error);
      }
   };

   const savePreferences = async (preferences) => {
      try {
         await axios.post('http://localhost:3000/api/preferences', preferences, { withCredentials: true });
         console.log('Preferences saved: ', preferences);
      } catch (error) {
         console.error('Error saving preferences:', error);
      }
   };

   const loadPreferences = async () => {
      try {
         const response = await axios.get('http://localhost:3000/api/preferences', { withCredentials: true });
         return response.data.preferences;
      } catch (error) {
         console.error('Error loading preferences:', error);
      }
   };

   useEffect(() => {
      const loadInitialData = async () => {
         const preferences = await loadPreferences();
         console.log('Preferences:', preferences);

         const initialDataRange = preferences && preferences.startDate && preferences.endDate ? [
            {
               startDate: new Date(preferences.startDate),
               endDate: new Date(preferences.endDate),
               key: 'selection',
            }
         ] : dateRange;

         setDateRange(initialDataRange);
         setGender(preferences?.gender || initialGender);
         setAgeGroup(preferences?.ageGroup || initialAgeGroup);
         setSelectedCategory(preferences?.category || null);
         setIsInitialLoad(false);

         await fetchData({
            startDate: initialDataRange[0].startDate.toISOString(),
            endDate: initialDataRange[0].endDate.toISOString(),
            ageGroup: preferences?.ageGroup === 'Age' ? null : preferences?.ageGroup,
            gender: preferences?.gender === 'Gender' ? null : preferences?.gender,
         });
      };

      if (location.pathname === '/dashboard' && !location.search) {
         loadInitialData();
      }
   }, [location]);

   useEffect(() => {
      if (!isInitialLoad) {
         const filters = {
            startDate: dateRange[0].startDate.toISOString(),
            endDate: dateRange[0].endDate.toISOString(),
            ageGroup: ageGroup === 'Age' ? null : ageGroup,
            gender: gender === 'Gender' ? null : gender,
         };

         const filterQuery = Object.fromEntries(
            Object.entries(filters).filter((entry) => entry[1] !== null && entry[1] !== undefined)
         );

         updateUrlParams(filterQuery);

         const loadData = async () => {
            const result = await fetchData(filterQuery);
            if (result.success) {
               const { features, timeSpent } = result.data;
               setBarChartData({
                  labels: features,
                  datasets: [
                     {
                        axis: 'y',
                        label: 'Total Time Spent (hrs)',
                        data: timeSpent,
                        backgroundColor: '#4472c6',
                        borderWidth: 2,
                     },
                  ],
               });
            }
         };

         loadData();
         savePreferences({ ...filterQuery, category: selectedCategory });
      }
   }, [dateRange, ageGroup, gender, selectedCategory]);

   const fetchLineChartData = async (category) => {
      try {
         const filters = {
            category: category,
            startDate: dateRange[0].startDate.toISOString(),
            endDate: dateRange[0].endDate.toISOString(),
            ageGroup: ageGroup === 'Age' ? null : ageGroup,
            gender: gender === 'Gender' ? null : gender,
         };

         const filterQuery = Object.fromEntries(
            Object.entries(filters).filter((entry) => entry[1] !== null)
         );

         const response = await axios.get('http://localhost:3000/api/category', { params: filterQuery, withCredentials: true });
         if (response.data.success) {
            const { time, values } = response.data.data;
            setLineChartData({
               labels: time,
               datasets: [
                  {
                     label: `Time Trend for ${category}`,
                     data: values,
                     fill: false,
                     backgroundColor: '#4373c5',
                     borderColor: '#4373c5',
                  },
               ],
            });
         }
      } catch (error) {
         console.error('Error fetching line chart data: ', error);
      }
   };

   const handleBarClick = (event, elements) => {
      if (elements.length > 0) {
         const index = elements[0].index;
         const category = barChartData.labels[index];
         setSelectedCategory(category);

         const filters = {
            startDate: dateRange[0].startDate.toISOString(),
            endDate: dateRange[0].endDate.toISOString(),
            ageGroup: ageGroup === 'Age' ? null : ageGroup,
            gender: gender === 'Gender' ? null : gender,
            category: category,
         };

         updateUrlParams(filters);
         fetchLineChartData(category);
      }
   };

   useEffect(() => {
      if (selectedCategory) {
         fetchLineChartData(selectedCategory);
      }
   }, [selectedCategory]);

   const toggleDatePicker = () => {
      setShowDatePicker(!showDatePicker);
   };

   const handleAgeGroupClick = () => {
      setAgeDropdownOpen(!ageDropdownOpen);
      setGenderDropdownOpen(false);
   };

   const handleGenderClick = () => {
      setGenderDropdownOpen(!genderDropdownOpen);
      setAgeDropdownOpen(false);
   };

   const handleAgeSelection = (age) => {
      setAgeGroup(age);
      setAgeDropdownOpen(false);
   };

   const handleGenderSelection = (gender) => {
      setGender(gender);
      setGenderDropdownOpen(false);
   };


   const barChartOptions = {
      indexAxis: 'y',
      barThickness: 25,
      hoverBackgroundColor: '#c75912',
      hoverBorderColor: '#4472c6',
      scales: {
         y: {
            beginAtZero: true,
            reverse: true,
            title: {
               display: true,
               text: 'Total Time Spent (hrs)',
            },
            adapters: {
               date: {
                  locale: enUS,
               },
            },
         },
      },
      onClick: handleBarClick,
   };

   const lineChartOptions = {
      scales: {
         x: {
            type: 'time',
            time: {
               unit: 'day',
               tooltipFormat: 'll',
            },
            adapters: {
               date: {
                  locale: enUS,
               },
            },
         },
         y: {
            beginAtZero: true,
            title: {
               display: true,
               text: 'Value',
            },
            adapters: {
               date: {
                  locale: enUS,
               },
            },
         },
      },
      plugins: {
         zoom: {
            pan: {
               enabled: true,
               mode: 'x&y',
            },
            zoom: {
               wheel: {
                  enabled: true,
               },
               pinch: {
                  enabled: true,
               },
               mode: 'x',
            },
         },
      },
   };

   return (
      <DashboardWrapper>
         <Header>
            <h1>Product Analytics Dashboard</h1>
         </Header>

         <FilterSection
            dateRange={dateRange}
            setDateRange={setDateRange}
            ageGroup={ageGroup}
            setAgeGroup={setAgeGroup}
            gender={gender}
            setGender={setGender}
            showDatePicker={showDatePicker}
            toggleDatePicker={toggleDatePicker}
            ageDropdownOpen={ageDropdownOpen}
            handleAgeGroupClick={handleAgeGroupClick}
            handleGenderClick={handleGenderClick}
            handleAgeSelection={handleAgeSelection}
            handleGenderSelection={handleGenderSelection}
            genderDropdownOpen={genderDropdownOpen}
         />

         <ChartSection
            barChartData={barChartData}
            lineChartData={lineChartData}
            selectedCategory={selectedCategory}
            barChartOptions={barChartOptions}
            lineChartOptions={lineChartOptions}
         />
      </DashboardWrapper>
   );
};

const DashboardWrapper = styled.div`
   padding: 2rem;
`;

const Header = styled.header`
   text-align: center;
   text-decoration: underline;
   h1 { font-size: 2rem; }
`;


export default Dashboard;
