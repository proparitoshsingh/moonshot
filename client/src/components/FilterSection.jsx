import { DateRangePicker } from 'react-date-range';
import axios from 'axios';
import styled from 'styled-components';

const FilterSection = ({
   dateRange,
   setDateRange,
   ageGroup,
   setAgeGroup,
   gender,
   setGender,
   showDatePicker,
   toggleDatePicker,
   ageDropdownOpen,
   handleAgeGroupClick,
   handleGenderClick,
   handleAgeSelection,
   handleGenderSelection,
   genderDropdownOpen
}) => {

   const resetPreferences = async () => {
      try {
         await axios.delete('http://localhost:3000/api/preferences', { withCredentials: true });
      } catch (error) {
         console.error('Error clearing preferences:', error);
      }
   };

   return (
      <FilterWrapper>
         <button className='reset' onClick={resetPreferences}>Reset Preferences</button>
         <div className="filters">
            <div className="filter-group">
               <button onClick={handleAgeGroupClick} className="filter-btn">
                  {ageGroup}
               </button>
               {ageDropdownOpen && (
                  <div className="dropdown-menu">
                     <div onClick={() => handleAgeSelection('15-25')}>15-25</div>
                     <div onClick={() => handleAgeSelection('>25')}>25+</div>
                  </div>
               )}
            </div>

            <div className="filter-group">
               <button onClick={handleGenderClick} className="filter-btn">
                  {gender}
               </button>
               {genderDropdownOpen && (
                  <div className="dropdown-menu">
                     <div onClick={() => handleGenderSelection('Male')}>Male</div>
                     <div onClick={() => handleGenderSelection('Female')}>Female</div>
                  </div>
               )}
            </div>
         </div>

         <div className="date-range">
            <button className='select-date-btn' onClick={toggleDatePicker}>
               {showDatePicker ? 'Done' : `${dateRange[0].startDate.toLocaleDateString()} - ${dateRange[0].endDate.toLocaleDateString()}`}
            </button>
            {showDatePicker && (
               <div className="date-range-picker">
                  <DateRangePicker
                     ranges={dateRange}
                     onChange={(ranges) => setDateRange([ranges.selection])}
                  />
               </div>
            )}
         </div>
      </FilterWrapper>
   );
};


const FilterWrapper = styled.section`
   display: flex;
   justify-content: end;
   align-items: center;
   margin-top: 1rem;

   .reset {
      padding: 10px 20px;
      background-color: #fff;
      border: 2px solid #ccc;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1rem;
      margin-right: 20px;
   }

   .filters {
      display: flex;
      flex-direction: row;
      align-items:center;
   }

   .filter-group {
      position: relative;
   }

   .filter-btn {
      padding: 10px;
      background-color: #fff;
      border: 2px solid #ccc;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1rem;
      margin-right: 20px;
   }

   .dropdown-menu {
      position: absolute;
      top: 103%;
      left: 0;
      background-color: white;
      border: 1px solid #ccc;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      z-index: 1;
      padding: 10px;
      cursor: pointer;
   }

   .dropdown-menu div {
      padding: 10px 20px;
   }

   .dropdown-menu div:hover {
      background-color: #f1f1f1;
   }

   .date-range-picker {
      max-width: 500px;
      position: absolute;
      right: 100px;
   }
      
   .select-date-btn {
      padding: 10px 20px;
      background-color: #fff;
      border: 2px solid #ccc;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1rem;
   }
`;

export default FilterSection;
