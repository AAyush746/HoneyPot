export interface Attack {
  latitude: boolean;
  longitude: any;
  id: number;
  timestamp: string;
  src_ip: string;
  username: string;
  password: string;
  command: string | null;
  country: string;
  country_code: string;
  city: string;
}