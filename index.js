import React, { useState, useEffect } from 'react';
import { Popover, Grid, Typography, TextField, Checkbox, Paper, Button, Avatar } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


export default function MultiColumnDropdownTextField({ onChange, anchorEl, onClose, initialValues, initialSelectedIds }) {
  const [selectedNames, setSelectedNames] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [sortOrder, setSortOrder] = useState(null);
  const [sortedBy, setSortedBy] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (initialValues) {
      const initialNamesArray = initialValues.split(', ').map(name => name.trim());
      setSelectedNames(initialNamesArray);
    }
    
    if (initialSelectedIds) {
      setSelectedIds(initialSelectedIds);
    }

    fetch( process.env.NEXT_PUBLIC_HOME_URL + '/api/userlist')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [initialValues, initialSelectedIds]);
  
  const filteredItems = items
    .filter(item => item.name.includes(searchTerm))
    .sort((a, b) => {
      if (!sortedBy || !sortOrder) return 0;
      if (sortOrder === 'asc') {
        if (a[sortedBy] < b[sortedBy]) return -1;
        if (a[sortedBy] > b[sortedBy]) return 1;
      } else {
        if (a[sortedBy] > b[sortedBy]) return -1;
        if (a[sortedBy] < b[sortedBy]) return 1;
      }
      return 0;
    });

  useEffect(() => {
    if (selectedNames.length === filteredItems.length && filteredItems.length !== 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedNames, filteredItems]);

  /** Item Click 시 */
  const handleListItemClick = (item) => {
    setSelectedNames(prevNames => {
        let newNames;
        let newIds = [...selectedIds];

        if (prevNames.includes(item.name)) {
            newNames = prevNames.filter(name => name !== item.name);
            newIds = newIds.filter(id => id !== item.id);
        } else {
            newNames = [...prevNames, item.name];
            newIds.push(item.id);
        }

        // 외부로 이름과 모든 선택된 항목들의 ID 값을 함께 전달
        onChange && onChange({ names: newNames.join(', '), ids: newIds.join(', ') });
        setSelectedIds(newIds);
        return newNames;
    });
};

  const handleSortClick = (column) => {
    if (sortedBy === column) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortedBy(column);
      setSortOrder('asc');
    }
  };

  const handleSelectAllClick = () => {
    if (selectAll) {
      setSelectedNames([]);
      onChange && onChange([]); // 외부로 전달
    } else {
      const newNames = filteredItems.map(item => item.name);
      setSelectedNames(newNames);
      onChange && onChange(newNames.join(', ')); // 외부로 전달
    }
  };

  const open = Boolean(anchorEl);

  return (
    <div style={{ width: '850px' }}>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        PaperProps={{ style: { width: '850px' } }}
      >
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          fullWidth
        />
        <Paper elevation={1} style={{ maxHeight: '400px', overflow: 'auto' }}>
          <Grid 
            container 
            spacing={1} 
            sx={{ 
              borderBottom: '1px solid #e0e0e0', 
              padding: '5px 10px',
              backgroundColor: "skyblue"
              
            }}
          >
            <Grid item xs={1} alignItems="center" justifyContent="center">
              <Checkbox
                edge="start"
                checked={selectAll}
                onChange={handleSelectAllClick}
                tabIndex={-1}
                disableRipple
                sx={{ paddingLeft: '20px' }}
              />
              
            </Grid>
            <Grid item xs={1} alignItems="center" justifyContent="center">
            </Grid>
            <Grid item xs={2} onClick={() => handleSortClick('id')}>
              <Button 
                fullWidth 
                disableRipple 
                startIcon={
                  sortedBy === 'id' ? (sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />) : null
                } 
                sx={{ justifyContent: 'flex-start' }}
              >
                ID
              </Button>
            </Grid>
            <Grid item xs={4} onClick={() => handleSortClick('name')}>
              <Button 
                fullWidth 
                disableRipple 
                startIcon={
                  sortedBy === 'name' ? (sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />) : null
                } 
                sx={{ justifyContent: 'flex-start' }}
              >
                성명
              </Button>
            </Grid>
            <Grid item xs={4} onClick={() => handleSortClick('department')}>
              <Button 
                fullWidth 
                disableRipple 
                startIcon={
                  sortedBy === 'department' ? (sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />) : null
                } 
                sx={{ justifyContent: 'flex-start' }}
              >
                부서
              </Button>
            </Grid>
          </Grid>
          {filteredItems.map((item, index) => (            
            <Grid 
              container 
              key={item.id}
              spacing={1} 
              alignItems="center"
              sx={{ 
                '&:hover, &:focus': { 
                  backgroundColor: "green",  
                  color: 'white'
                } 
              }}
              onClick={() => handleListItemClick(item)}
            >
              <Grid item xs={1} alignItems="center" justifyContent="center"> 
                <Checkbox
                  edge="start"
                  checked={selectedNames.includes(item.name)}
                  tabIndex={-1}
                  disableRipple
                  sx={{ paddingLeft: '30px' }}
                />
              </Grid>
              <Grid item xs={1} alignItems="center" justifyContent="center">
                <Avatar src={"/images/user1.png"} alt="User Image" sx={{ width: 24, height: 24 }} />
              </Grid>
              <Grid item xs={2}><Typography>{item.id}</Typography></Grid>
              <Grid item xs={4}><Typography>{item.name}</Typography></Grid>
              <Grid item xs={4}><Typography>{item.department}</Typography></Grid>
            </Grid>
          ))}
        </Paper>
      </Popover>
    </div>
  );
}