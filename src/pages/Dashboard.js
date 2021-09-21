import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container, TextField } from '@mui/material/';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import {
  CountryDropdown,
  CountryRegionData
} from 'react-country-region-selector';
import { Scatter, Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

export default function Dashboard() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [result, setResult] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [country, setCountry] = useState('Worldwide');
  const [sevenDays, setSevenDays] = useState('');

  const handleChange = (e) => {
    setCountry(e.target.value);
  };

  useEffect(() => {
    let endPoint;
    if (country === 'Worldwide') {
      endPoint = 'https://disease.sh/v3/covid-19/all';
    } else {
      endPoint = `https://disease.sh/v3/covid-19/countries/${country[0]}?strict=true
      `;
    }
    axios.get(endPoint).then(
      (result) => {
        setIsLoaded(true);
        setResult(result.data);
        console.log(result);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, [country]);

  let onSelect = () => {
    axios
      .get(`https://disease.sh/v3/covid-19/historical/${country[0]}?lastdays=7`)
      .then(
        (result) => {
          setIsLoaded(true);

          let deaths = Object.entries(result.data.timeline.deaths).map(
            ([k, v]) => ({ [k]: v })
          );

          let cases = Object.entries(result.data.timeline.cases).map(
            ([k, v]) => ({ [k]: v })
          );

          setSevenDays({
            datasets: [
              {
                label: 'Deaths',
                borderColor: '#f67019',
                backgroundColor: '#f67019',
                data: deaths.map((item) => {
                  var newArray = {
                    y: item[Object.keys(item)[0]],
                    x: new Date(Object.keys(item)[0])
                  };
                  return newArray;
                })
              },
              {
                label: 'Cases',
                data: cases.map((item) => {
                  var newArray = {
                    y: item[Object.keys(item)[0]],
                    x: new Date(Object.keys(item)[0])
                  };
                  return newArray;
                })
              }
            ]
          });
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  const options = {
    scales: {
      x: {
        type: 'time'
      }
    }
  };

  return (
    <Container>
      <br />
      <br />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Country</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={country}
                  label="Country"
                  onChange={handleChange}
                >
                  <MenuItem value={'Worldwide'}>Worldwide</MenuItem>
                  {CountryRegionData.map((option, index) => (
                    <MenuItem key={option[0]} value={option}>
                      {option[0]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* Total cases */}
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Total Cases
                </Typography>

                {result && result.cases ? (
                  <div>
                    <Typography variant="h6">
                      <b>{result.cases}</b>
                    </Typography>
                  </div>
                ) : (
                  'No data found'
                )}
              </CardContent>
              <CardActions>
                <Button size="small" onClick={onSelect}>
                  See 7-day graph
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* Total deaths */}
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Total deaths
                </Typography>
                {result && result.deaths ? (
                  <div>
                    <Typography variant="h6">
                      <b>{result.deaths}</b>
                    </Typography>
                  </div>
                ) : (
                  'No data found'
                )}
              </CardContent>
              <CardActions>
                <Button size="small" onClick={onSelect}>
                  See 7-day graph
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12}>
            {sevenDays ? <Scatter data={sevenDays} options={options} /> : ''}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
