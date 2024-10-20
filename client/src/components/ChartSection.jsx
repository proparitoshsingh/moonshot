import { Bar, Line } from 'react-chartjs-2';
import styled from 'styled-components';

const ChartSection = ({ barChartData, lineChartData, selectedCategory, barChartOptions, lineChartOptions }) => {
   return (
      <ChartsWrapper>
         <ChartPlaceholder selectedCategory={selectedCategory}>
            <h2>Bar Chart: Features vs Time Spent</h2>
            {barChartData.labels.length > 0 ? (
               <Bar className='bar-chart' data={barChartData} options={barChartOptions} />
            ) : (
               <p>Loading data...</p>
            )}
         </ChartPlaceholder>

         {lineChartData && selectedCategory && (
            <ChartPlaceholder selectedCategory={selectedCategory}>
               <h2>Line Chart: Time Trend for {selectedCategory}</h2>
               <Line className='line-chart' data={lineChartData} options={lineChartOptions} />
            </ChartPlaceholder>
         )}
      </ChartsWrapper>
   );
};

const ChartsWrapper = styled.section`
   display: flex;
   min-height: 60vh;
   justify-content: center;
   margin: auto 2rem;

`;

const ChartPlaceholder = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   margin: 2rem;
   border: 1px dashed #ccc;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
   padding: 2rem;
   text-align: center;
   h2 { font-size: 1.5rem; }
   min-height: ${({ selectedCategory }) => (selectedCategory ? '55vh' : '58vh')};;
   min-width: ${({ selectedCategory }) => (selectedCategory ? '38vw' : '58vw')};;
`;

export default ChartSection;
