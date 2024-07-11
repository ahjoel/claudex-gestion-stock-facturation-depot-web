import toast from 'react-hot-toast'
import { t } from 'i18next'

const mainColor: { [key: string]: string } = {
  contrastText: '#FFF',
  success: '#28C76F',
  error: '#EA5455',
  info: '#00CFE8',
  warning: '#FF9F43',
  primary: '#D51926',
  secondary: '#A8AAAE'
}

type InternalFunction = () => Promise<any>

export const promiseFunction = async (
  internalFunction: InternalFunction,
  successMessage: string,
  errorMessage = '',
  duration = 10000
) => {
  await toast.promise(
    internalFunction(),
    {
      loading: 'Loading',
      success: () => `${t(successMessage)}`,
      error: err => `${t(errorMessage)}: ${t(err.toString())}`
    },
    {
      style: {
        padding: '16px',
        color: mainColor.primary,
        border: `1px solid ${mainColor.primary}`,
        minWidth: '250px'
      },
      iconTheme: {
        primary: mainColor.primary,
        secondary: mainColor.contrastText
      },
      success: {
        duration: duration,
        style: {
          padding: '16px',
          color: mainColor.success,
          border: `1px solid ${mainColor.success}`
        },
        iconTheme: {
          primary: mainColor.success,
          secondary: mainColor.contrastText
        }

        // icon: '🔥'
      },
      error: {
        duration: duration,
        style: {
          padding: '16px',
          color: mainColor.error,
          border: `1px solid ${mainColor.error}`
        },
        iconTheme: {
          primary: mainColor.error,
          secondary: mainColor.contrastText
        }
      }
    }
  )
}
