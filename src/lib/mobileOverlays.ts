import { ORIG_W, ORIG_H, SCREEN, AMZ, ADS } from './constants'

export const MOBILE_SCREEN = {
  left: `${SCREEN.X1 / ORIG_W * 100}%`,
  top: `${SCREEN.Y1 / ORIG_H * 100}%`,
  width: `${(SCREEN.X2 - SCREEN.X1) / ORIG_W * 100}%`,
  height: `${(SCREEN.Y2 - SCREEN.Y1) / ORIG_H * 100}%`,
}

export const MOBILE_AMZ = {
  left: `${AMZ.X1 / ORIG_W * 100}%`,
  top: `${AMZ.Y1 / ORIG_H * 100}%`,
  width: `${(AMZ.X2 - AMZ.X1) / ORIG_W * 100}%`,
  height: `${(AMZ.Y2 - AMZ.Y1) / ORIG_H * 100}%`,
}

export const MOBILE_ADS = {
  left: `${ADS.X1 / ORIG_W * 100}%`,
  top: `${ADS.Y1 / ORIG_H * 100}%`,
  width: `${(ADS.X2 - ADS.X1) / ORIG_W * 100}%`,
  height: `${(ADS.Y2 - ADS.Y1) / ORIG_H * 100}%`,
}
