export interface DriverStanding {
  position: string;
  points: string;
  Driver: {
    driverId: string;
    code: string;
    permanentNumber: string;
    givenName: string;
    familyName: string;
    nationality: string;
  };
  Constructor: {
    name: string;
  };
}

export interface Driver {
  driverId: string;
  permanentNumber: string;
  code: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
}

export interface Race {
  season: string;
  round: string;
  raceName: string;
  circuit: Circuit;
  date: string;
  time: string;
}

export interface Circuit {
  circuitId: string;
  circuitName: string;
  Location: {
    lat: string;
    long: string;
    locality: string;
    country: string;
  };
}

export interface Standing {
  position: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
}

export interface Constructor {
  constructorId: string;
  name: string;
  nationality: string;
}