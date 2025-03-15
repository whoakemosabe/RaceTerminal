// 2025 F1 Race Schedule with UTC and ET times
export const schedule = {
  races: [
    {
      round: 0,
      type: 'testing',
      name: 'Pre-Season Testing',
      officialName: 'FORMULA 1 ARAMCO PRE-SEASON TESTING 2025',
      circuit: {
        name: 'Bahrain International Circuit',
        location: 'Sakhir',
        country: 'Bahrain'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-02-26T07:00:00Z', dateET: '2025-02-26T02:00:00' },
        practice2: { name: 'Practice 2', date: '2025-02-27T07:00:00Z', dateET: '2025-02-27T02:00:00' },
        practice3: { name: 'Practice 3', date: '2025-02-28T07:00:00Z', dateET: '2025-02-28T02:00:00' }
      }
    },
    {
      round: 1,
      type: 'conventional',
      name: 'Australian Grand Prix',
      officialName: 'FORMULA 1 LOUIS VUITTON AUSTRALIAN GRAND PRIX 2025',
      circuit: {
        name: 'Albert Park Circuit',
        location: 'Melbourne',
        country: 'Australia'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-03-14T02:30:00Z', dateET: '2025-03-13T21:30:00' },
        practice2: { name: 'Practice 2', date: '2025-03-14T06:00:00Z', dateET: '2025-03-14T01:00:00' },
        practice3: { name: 'Practice 3', date: '2025-03-15T02:30:00Z', dateET: '2025-03-14T21:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-03-15T06:00:00Z', dateET: '2025-03-15T01:00:00' },
        race: { name: 'Race', date: '2025-03-16T05:00:00Z', dateET: '2025-03-16T00:00:00' }
      }
    },
    {
      round: 2,
      type: 'sprint_qualifying',
      name: 'Chinese Grand Prix',
      officialName: 'FORMULA 1 HEINEKEN CHINESE GRAND PRIX 2025',
      circuit: {
        name: 'Shanghai International Circuit',
        location: 'Shanghai',
        country: 'China'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-03-21T03:30:00Z', dateET: '2025-03-20T23:30:00' },
        sprint_qualifying: { name: 'Sprint Qualifying', date: '2025-03-21T07:30:00Z', dateET: '2025-03-21T03:30:00' },
        sprint: { name: 'Sprint', date: '2025-03-22T03:00:00Z', dateET: '2025-03-21T23:00:00' },
        qualifying: { name: 'Qualifying', date: '2025-03-22T07:00:00Z', dateET: '2025-03-22T03:00:00' },
        race: { name: 'Race', date: '2025-03-23T07:00:00Z', dateET: '2025-03-23T03:00:00' }
      }
    },
    {
      round: 3,
      type: 'conventional',
      name: 'Japanese Grand Prix',
      officialName: 'FORMULA 1 LENOVO JAPANESE GRAND PRIX 2025',
      circuit: {
        name: 'Suzuka International Racing Course',
        location: 'Suzuka',
        country: 'Japan'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-04-04T02:30:00Z', dateET: '2025-04-03T22:30:00' },
        practice2: { name: 'Practice 2', date: '2025-04-04T06:00:00Z', dateET: '2025-04-04T02:00:00' },
        practice3: { name: 'Practice 3', date: '2025-04-05T02:30:00Z', dateET: '2025-04-04T22:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-04-05T06:00:00Z', dateET: '2025-04-05T02:00:00' },
        race: { name: 'Race', date: '2025-04-06T05:00:00Z', dateET: '2025-04-06T01:00:00' }
      }
    },
    {
      round: 4,
      type: 'conventional',
      name: 'Bahrain Grand Prix',
      officialName: 'FORMULA 1 GULF AIR BAHRAIN GRAND PRIX 2025',
      circuit: {
        name: 'Bahrain International Circuit',
        location: 'Sakhir',
        country: 'Bahrain'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-04-11T11:30:00Z', dateET: '2025-04-11T07:30:00' },
        practice2: { name: 'Practice 2', date: '2025-04-11T15:00:00Z', dateET: '2025-04-11T11:00:00' },
        practice3: { name: 'Practice 3', date: '2025-04-12T12:30:00Z', dateET: '2025-04-12T08:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-04-12T16:00:00Z', dateET: '2025-04-12T12:00:00' },
        race: { name: 'Race', date: '2025-04-13T15:00:00Z', dateET: '2025-04-13T11:00:00' }
      }
    },
    {
      round: 5,
      type: 'conventional',
      name: 'Saudi Arabian Grand Prix',
      officialName: 'FORMULA 1 STC SAUDI ARABIAN GRAND PRIX 2025',
      circuit: {
        name: 'Jeddah Corniche Circuit',
        location: 'Jeddah',
        country: 'Saudi Arabia'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-04-18T13:30:00Z', dateET: '2025-04-18T09:30:00' },
        practice2: { name: 'Practice 2', date: '2025-04-18T17:00:00Z', dateET: '2025-04-18T13:00:00' },
        practice3: { name: 'Practice 3', date: '2025-04-19T13:30:00Z', dateET: '2025-04-19T09:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-04-19T17:00:00Z', dateET: '2025-04-19T13:00:00' },
        race: { name: 'Race', date: '2025-04-20T17:00:00Z', dateET: '2025-04-20T13:00:00' }
      }
    },
    {
      round: 6,
      type: 'sprint_qualifying',
      name: 'Miami Grand Prix',
      officialName: 'FORMULA 1 CRYPTO.COM MIAMI GRAND PRIX 2025',
      circuit: {
        name: 'Miami International Autodrome',
        location: 'Miami',
        country: 'United States'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-05-02T16:30:00Z', dateET: '2025-05-02T12:30:00' },
        sprint_qualifying: { name: 'Sprint Qualifying', date: '2025-05-02T19:30:00Z', dateET: '2025-05-02T15:30:00' },
        sprint: { name: 'Sprint', date: '2025-05-03T15:00:00Z', dateET: '2025-05-03T11:00:00' },
        qualifying: { name: 'Qualifying', date: '2025-05-03T20:00:00Z', dateET: '2025-05-03T16:00:00' },
        race: { name: 'Race', date: '2025-05-04T20:00:00Z', dateET: '2025-05-04T16:00:00' }
      }
    },
    {
      round: 7,
      type: 'conventional',
      name: 'Emilia Romagna Grand Prix',
      officialName: 'FORMULA 1 AWS GRAN PREMIO DEL MADE IN ITALY E DELL\'EMILIA-ROMAGNA 2025',
      circuit: {
        name: 'Autodromo Enzo e Dino Ferrari',
        location: 'Imola',
        country: 'Italy'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-05-16T11:30:00Z', dateET: '2025-05-16T07:30:00' },
        practice2: { name: 'Practice 2', date: '2025-05-16T15:00:00Z', dateET: '2025-05-16T11:00:00' },
        practice3: { name: 'Practice 3', date: '2025-05-17T10:30:00Z', dateET: '2025-05-17T06:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-05-17T14:00:00Z', dateET: '2025-05-17T10:00:00' },
        race: { name: 'Race', date: '2025-05-18T13:00:00Z', dateET: '2025-05-18T09:00:00' }
      }
    },
    {
      round: 8,
      type: 'conventional',
      name: 'Monaco Grand Prix',
      officialName: 'FORMULA 1 TAG HEUER GRAND PRIX DE MONACO 2025',
      circuit: {
        name: 'Circuit de Monaco',
        location: 'Monaco',
        country: 'Monaco'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-05-23T11:30:00Z', dateET: '2025-05-23T07:30:00' },
        practice2: { name: 'Practice 2', date: '2025-05-23T15:00:00Z', dateET: '2025-05-23T11:00:00' },
        practice3: { name: 'Practice 3', date: '2025-05-24T10:30:00Z', dateET: '2025-05-24T06:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-05-24T14:00:00Z', dateET: '2025-05-24T10:00:00' },
        race: { name: 'Race', date: '2025-05-25T13:00:00Z', dateET: '2025-05-25T09:00:00' }
      }
    },
    {
      round: 9,
      type: 'conventional',
      name: 'Spanish Grand Prix',
      officialName: 'FORMULA 1 ARAMCO GRAN PREMIO DE ESPAÑA 2025',
      circuit: {
        name: 'Circuit de Barcelona-Catalunya',
        location: 'Barcelona',
        country: 'Spain'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-05-30T11:30:00Z', dateET: '2025-05-30T07:30:00' },
        practice2: { name: 'Practice 2', date: '2025-05-30T15:00:00Z', dateET: '2025-05-30T11:00:00' },
        practice3: { name: 'Practice 3', date: '2025-05-31T10:30:00Z', dateET: '2025-05-31T06:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-05-31T14:00:00Z', dateET: '2025-05-31T10:00:00' },
        race: { name: 'Race', date: '2025-06-01T13:00:00Z', dateET: '2025-06-01T09:00:00' }
      }
    },
    {
      round: 10,
      type: 'conventional',
      name: 'Canadian Grand Prix',
      officialName: 'FORMULA 1 PIRELLI GRAND PRIX DU CANADA 2025',
      circuit: {
        name: 'Circuit Gilles Villeneuve',
        location: 'Montréal',
        country: 'Canada'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-06-13T17:30:00Z', dateET: '2025-06-13T13:30:00' },
        practice2: { name: 'Practice 2', date: '2025-06-13T21:00:00Z', dateET: '2025-06-13T17:00:00' },
        practice3: { name: 'Practice 3', date: '2025-06-14T16:30:00Z', dateET: '2025-06-14T12:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-06-14T20:00:00Z', dateET: '2025-06-14T16:00:00' },
        race: { name: 'Race', date: '2025-06-15T19:00:00Z', dateET: '2025-06-15T15:00:00' }
      }
    },
    {
      round: 11,
      type: 'conventional',
      name: 'Austrian Grand Prix',
      officialName: 'FORMULA 1 MSC CRUISES AUSTRIAN GRAND PRIX 2025',
      circuit: {
        name: 'Red Bull Ring',
        location: 'Spielberg',
        country: 'Austria'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-06-27T11:30:00Z', dateET: '2025-06-27T07:30:00' },
        practice2: { name: 'Practice 2', date: '2025-06-27T15:00:00Z', dateET: '2025-06-27T11:00:00' },
        practice3: { name: 'Practice 3', date: '2025-06-28T10:30:00Z', dateET: '2025-06-28T06:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-06-28T14:00:00Z', dateET: '2025-06-28T10:00:00' },
        race: { name: 'Race', date: '2025-06-29T13:00:00Z', dateET: '2025-06-29T09:00:00' }
      }
    },
    {
      round: 12,
      type: 'conventional',
      name: 'British Grand Prix',
      officialName: 'FORMULA 1 QATAR AIRWAYS BRITISH GRAND PRIX 2025',
      circuit: {
        name: 'Silverstone Circuit',
        location: 'Silverstone',
        country: 'United Kingdom'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-07-04T11:30:00Z', dateET: '2025-07-04T07:30:00' },
        practice2: { name: 'Practice 2', date: '2025-07-04T15:00:00Z', dateET: '2025-07-04T11:00:00' },
        practice3: { name: 'Practice 3', date: '2025-07-05T10:30:00Z', dateET: '2025-07-05T06:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-07-05T14:00:00Z', dateET: '2025-07-05T10:00:00' },
        race: { name: 'Race', date: '2025-07-06T14:00:00Z', dateET: '2025-07-06T10:00:00' }
      }
    },
    {
      round: 13,
      type: 'sprint_qualifying',
      name: 'Belgian Grand Prix',
      officialName: 'FORMULA 1 MOËT & CHANDON BELGIAN GRAND PRIX 2025',
      circuit: {
        name: 'Circuit de Spa-Francorchamps',
        location: 'Spa-Francorchamps',
        country: 'Belgium'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-07-25T10:30:00Z', dateET: '2025-07-25T06:30:00' },
        sprint_qualifying: { name: 'Sprint Qualifying', date: '2025-07-25T14:30:00Z', dateET: '2025-07-25T10:30:00' },
        sprint: { name: 'Sprint', date: '2025-07-26T10:00:00Z', dateET: '2025-07-26T06:00:00' },
        qualifying: { name: 'Qualifying', date: '2025-07-26T14:00:00Z', dateET: '2025-07-26T10:00:00' },
        race: { name: 'Race', date: '2025-07-27T13:00:00Z', dateET: '2025-07-27T09:00:00' }
      }
    },
    {
      round: 14,
      type: 'conventional',
      name: 'Hungarian Grand Prix',
      officialName: 'FORMULA 1 LENOVO HUNGARIAN GRAND PRIX 2025',
      circuit: {
        name: 'Hungaroring',
        location: 'Budapest',
        country: 'Hungary'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-08-01T11:30:00Z', dateET: '2025-08-01T07:30:00' },
        practice2: { name: 'Practice 2', date: '2025-08-01T15:00:00Z', dateET: '2025-08-01T11:00:00' },
        practice3: { name: 'Practice 3', date: '2025-08-02T10:30:00Z', dateET: '2025-08-02T06:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-08-02T14:00:00Z', dateET: '2025-08-02T10:00:00' },
        race: { name: 'Race', date: '2025-08-03T13:00:00Z', dateET: '2025-08-03T09:00:00' }
      }
    },
    {
      round: 15,
      type: 'conventional',
      name: 'Dutch Grand Prix',
      officialName: 'FORMULA 1 HEINEKEN DUTCH GRAND PRIX 2025',
      circuit: {
        name: 'Circuit Zandvoort',
        location: 'Zandvoort',
        country: 'Netherlands'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-08-29T10:30:00Z', dateET: '2025-08-29T06:30:00' },
        practice2: { name: 'Practice 2', date: '2025-08-29T14:00:00Z', dateET: '2025-08-29T10:00:00' },
        practice3: { name: 'Practice 3', date: '2025-08-30T09:30:00Z', dateET: '2025-08-30T05:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-08-30T13:00:00Z', dateET: '2025-08-30T09:00:00' },
        race: { name: 'Race', date: '2025-08-31T13:00:00Z', dateET: '2025-08-31T09:00:00' }
      }
    },
    {
      round: 16,
      type: 'conventional',
      name: 'Italian Grand Prix',
      officialName: 'FORMULA 1 PIRELLI GRAN PREMIO D\'ITALIA 2025',
      circuit: {
        name: 'Autodromo Nazionale Monza',
        location: 'Monza',
        country: 'Italy'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-09-05T11:30:00Z', dateET: '2025-09-05T07:30:00' },
        practice2: { name: 'Practice 2', date: '2025-09-05T15:00:00Z', dateET: '2025-09-05T11:00:00' },
        practice3: { name: 'Practice 3', date: '2025-09-06T10:30:00Z', dateET: '2025-09-06T06:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-09-06T14:00:00Z', dateET: '2025-09-06T10:00:00' },
        race: { name: 'Race', date: '2025-09-07T13:00:00Z', dateET: '2025-09-07T09:00:00' }
      }
    },
    {
      round: 17,
      type: 'conventional',
      name: 'Azerbaijan Grand Prix',
      officialName: 'FORMULA 1 QATAR AIRWAYS AZERBAIJAN GRAND PRIX 2025',
      circuit: {
        name: 'Baku City Circuit',
        location: 'Baku',
        country: 'Azerbaijan'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-09-19T08:30:00Z', dateET: '2025-09-19T04:30:00' },
        practice2: { name: 'Practice 2', date: '2025-09-19T12:00:00Z', dateET: '2025-09-19T08:00:00' },
        practice3: { name: 'Practice 3', date: '2025-09-20T08:30:00Z', dateET: '2025-09-20T04:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-09-20T12:00:00Z', dateET: '2025-09-20T08:00:00' },
        race: { name: 'Race', date: '2025-09-21T11:00:00Z', dateET: '2025-09-21T07:00:00' }
      }
    },
    {
      round: 18,
      type: 'conventional',
      name: 'Singapore Grand Prix',
      officialName: 'FORMULA 1 SINGAPORE AIRLINES SINGAPORE GRAND PRIX 2025',
      circuit: {
        name: 'Marina Bay Street Circuit',
        location: 'Marina Bay',
        country: 'Singapore'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-10-03T09:30:00Z', dateET: '2025-10-03T05:30:00' },
        practice2: { name: 'Practice 2', date: '2025-10-03T13:00:00Z', dateET: '2025-10-03T09:00:00' },
        practice3: { name: 'Practice 3', date: '2025-10-04T09:30:00Z', dateET: '2025-10-04T05:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-10-04T13:00:00Z', dateET: '2025-10-04T09:00:00' },
        race: { name: 'Race', date: '2025-10-05T12:00:00Z', dateET: '2025-10-05T08:00:00' }
      }
    },
    {
      round: 19,
      type: 'sprint_qualifying',
      name: 'United States Grand Prix',
      officialName: 'FORMULA 1 MSC CRUISES UNITED STATES GRAND PRIX 2025',
      circuit: {
        name: 'Circuit of The Americas',
        location: 'Austin',
        country: 'United States'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-10-17T17:30:00Z', dateET: '2025-10-17T13:30:00' },
        sprint_qualifying: { name: 'Sprint Qualifying', date: '2025-10-17T21:30:00Z', dateET: '2025-10-17T17:30:00' },
        sprint: { name: 'Sprint', date: '2025-10-18T17:00:00Z', dateET: '2025-10-18T13:00:00' },
        qualifying: { name: 'Qualifying', date: '2025-10-18T21:00:00Z', dateET: '2025-10-18T17:00:00' },
        race: { name: 'Race', date: '2025-10-19T19:00:00Z', dateET: '2025-10-19T15:00:00' }
      }
    },
    {
      round: 20,
      type: 'conventional',
      name: 'Mexico City Grand Prix',
      officialName: 'FORMULA 1 GRAN PREMIO DE LA CIUDAD DE MÉXICO 2025',
      circuit: {
        name: 'Autódromo Hermanos Rodríguez',
        location: 'Mexico City',
        country: 'Mexico'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-10-24T18:30:00Z', dateET: '2025-10-24T14:30:00' },
        practice2: { name: 'Practice 2', date: '2025-10-24T22:00:00Z', dateET: '2025-10-24T18:00:00' },
        practice3: { name: 'Practice 3', date: '2025-10-25T17:30:00Z', dateET: '2025-10-25T13:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-10-25T21:00:00Z', dateET: '2025-10-25T17:00:00' },
        race: { name: 'Race', date: '2025-10-26T20:00:00Z', dateET: '2025-10-26T16:00:00' }
      }
    },
    {
      round: 21,
      type: 'sprint_qualifying',
      name: 'São Paulo Grand Prix',
      officialName: 'FORMULA 1 MSC CRUISES GRANDE PRÊMIO DE SÃO PAULO 2025',
      circuit: {
        name: 'Autódromo José Carlos Pace',
        location: 'São Paulo',
        country: 'Brazil'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-11-07T13:30:00Z', dateET: '2025-11-07T09:30:00' },
        sprint_qualifying: { name: 'Sprint Qualifying', date: '2025-11-07T17:30:00Z', dateET: '2025-11-07T13:30:00' },
        sprint: { name: 'Sprint', date: '2025-11-08T13:00:00Z', dateET: '2025-11-08T09:00:00' },
        qualifying: { name: 'Qualifying', date: '2025-11-08T17:00:00Z', dateET: '2025-11-08T13:00:00' },
        race: { name: 'Race', date: '2025-11-09T16:00:00Z', dateET: '2025-11-09T12:00:00' }
      }
    },
    {
      round: 22,
      type: 'conventional',
      name: 'Las Vegas Grand Prix',
      officialName: 'FORMULA 1 HEINEKEN LAS VEGAS GRAND PRIX 2025',
      circuit: {
        name: 'Las Vegas Strip Circuit',
        location: 'Las Vegas',
        country: 'United States'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-11-21T00:30:00Z', dateET: '2025-11-20T19:30:00' },
        practice2: { name: 'Practice 2', date: '2025-11-21T04:00:00Z', dateET: '2025-11-20T23:00:00' },
        practice3: { name: 'Practice 3', date: '2025-11-22T00:30:00Z', dateET: '2025-11-21T19:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-11-22T04:00:00Z', dateET: '2025-11-21T23:00:00' },
        race: { name: 'Race', date: '2025-11-23T04:00:00Z', dateET: '2025-11-22T23:00:00' }
      }
    },
    {
      round: 23,
      type: 'sprint_qualifying',
      name: 'Qatar Grand Prix',
      officialName: 'FORMULA 1 QATAR AIRWAYS QATAR GRAND PRIX 2025',
      circuit: {
        name: 'Lusail International Circuit',
        location: 'Lusail',
        country: 'Qatar'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-11-28T12:30:00Z', dateET: '2025-11-28T08:30:00' },
        sprint_qualifying: { name: 'Sprint Qualifying', date: '2025-11-28T16:30:00Z', dateET: '2025-11-28T12:30:00' },
        sprint: { name: 'Sprint', date: '2025-11-29T13:00:00Z', dateET: '2025-11-29T09:00:00' },
        qualifying: { name: 'Qualifying', date: '2025-11-29T17:00:00Z', dateET: '2025-11-29T13:00:00' },
        race: { name: 'Race', date: '2025-11-30T15:00:00Z', dateET: '2025-11-30T11:00:00' }
      }
    },
    {
      round: 24,
      type: 'conventional',
      name: 'Abu Dhabi Grand Prix',
      officialName: 'FORMULA 1 ETIHAD AIRWAYS ABU DHABI GRAND PRIX 2025',
      circuit: {
        name: 'Yas Marina Circuit',
        location: 'Yas Island',
        country: 'United Arab Emirates'
      },
      sessions: {
        practice1: { name: 'Practice 1', date: '2025-12-05T08:30:00Z', dateET: '2025-12-05T04:30:00' },
        practice2: { name: 'Practice 2', date: '2025-12-05T12:00:00Z', dateET: '2025-12-05T08:00:00' },
        practice3: { name: 'Practice 3', date: '2025-12-06T09:30:00Z', dateET: '2025-12-06T05:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-12-06T13:00:00Z', dateET: '2025-12-06T09:00:00' },
        race: { name: 'Race', date: '2025-12-07T12:00:00Z', dateET: '2025-12-07T08:00:00' }
      }
    }
  ],
  
  // Helper functions
  getNextRace() {
    const now = new Date();
    return this.races.find(race => 
      new Date(race.sessions.race?.date || race.sessions.practice1.date) > now
    );
  },
  
  getRaceByRound(round: number) {
    return this.races.find(race => race.round === round);
  },
  
  formatDate(date: string, timeZone: 'UTC' | 'ET' = 'UTC') {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timeZone === 'ET' ? 'America/New_York' : 'UTC',
      hour12: false
    });
  },

  getActiveSession() {
    const now = new Date();
    let activeRace = null;
    let activeSession = null;
    let nextSession = null;
    
    for (const race of this.races) {
      if (race.type === 'testing') continue;
      
      // Get all sessions sorted by date
      const sessions = Object.entries(race.sessions)
        .filter(([_, session]) => session) // Filter out undefined sessions
        .map(([key, session]) => ({
          key,
          ...session,
          startTime: new Date(session.dateET), // Use ET date
          endTime: null as Date | null
        }))
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
      
      // Calculate end times for all sessions
      sessions.forEach(session => {
        const duration = (() => {
          switch (session.key) {
            case 'practice1':
            case 'practice2':
            case 'practice3':
            case 'qualifying':
              return 60; // 1 hour
            case 'sprint_qualifying':
              return 45; // 45 minutes
            case 'sprint':
              return 30; // 30 minutes
            case 'race':
              return 120; // 2 hours
            default:
              return 60; // Default 1 hour
          }
        })();
        session.endTime = new Date(session.startTime.getTime() + (duration * 60 * 1000));
      });
      
      // Calculate weekend boundaries
      const weekendStart = sessions[0].startTime;
      const lastSession = sessions[sessions.length - 1].startTime;
      const weekendEnd = new Date(lastSession.getTime() + (4 * 60 * 60 * 1000)); // 4 hours after last session for ET timezone
      const now = new Date();
      
      // Check if we're in a race weekend
      if (now >= weekendStart && now <= weekendEnd) {
        activeRace = race;
        
        let foundActive = false;
        let foundNext = false;
        for (let i = 0; i < sessions.length; i++) {
          const session = sessions[i];
          
          // Check if session is active
          if (now >= session.startTime && now <= session.endTime) {
            foundActive = true;
            activeSession = {
              type: session.key,
              name: session.name,
              startTime: session.startTime,
              endTime: session.endTime,
              status: session.name,
              timeRemaining: Math.ceil((session.endTime.getTime() - now.getTime()) / 60000) // minutes remaining, rounded up
            };
            continue; // Continue to find next session
          }
          
          // If session hasn't started yet and we haven't found active or next session
          if (now < session.startTime && !foundNext) {
            foundNext = true;
            nextSession = {
              type: session.key,
              name: session.name,
              startTime: session.startTime,
              endTime: session.endTime,
              status: session.name,
              countdown: Math.ceil((session.startTime.getTime() - now.getTime()) / 60000) // minutes until start, rounded up
            };
            break; // Found next session, no need to check others
          }
        }
        break; // Found active race weekend, no need to check others
      }
      
      // If no active session found, check for next race weekend
      if (!activeSession && !nextSession && now < weekendStart) {
        const firstSession = sessions[0];
        
        nextSession = {
          type: firstSession.key,
          name: firstSession.name,
          startTime: firstSession.startTime,
          endTime: firstSession.endTime,
          status: firstSession.name,
          countdown: Math.ceil((firstSession.startTime.getTime() - now.getTime()) / 60000)
        };
        activeRace = race;
        break;
      }
    }
    
    if (!activeRace) return null;
    
    return {
      race: activeRace,
      session: activeSession,
      nextSession,
      isRaceWeekend: true
    };
  }
};

// Export types for TypeScript support
export interface Race {
  round: number;
  type: 'testing' | 'conventional' | 'sprint_qualifying';
  name: string;
  officialName: string;
  circuit: {
    name: string;
    location: string;
    country: string;
  };
  sessions: {
    practice1: Session;
    practice2?: Session;
    practice3?: Session;
    qualifying?: Session;
    sprint_qualifying?: Session;
    sprint?: Session;
    race?: Session;
  };
}

export interface Session {
  name: string;
  date: string;
  dateET: string;
}