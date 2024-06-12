import { Grid } from '@mui/material'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import Activities from 'src/views/dashboards/ecommerce/Activities'
import WelcomeUser from 'src/views/dashboards/ecommerce/WelcomeUser'
import ReglementListe from 'src/views/dashboards/ecommerce/ReglementListe'

const EcommerceDashboard = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <WelcomeUser />
        </Grid>
        <Grid item xs={12} md={8}>
          <Activities />
        </Grid>
        <Grid item xs={20}>
          <ReglementListe />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default EcommerceDashboard
