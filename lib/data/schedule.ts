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
        practice1: { name: 'Practice 1', date: '2025-02-26T10:00:00Z', dateET: '2025-02-26T02:00:00' },
        practice2: { name: 'Practice 2', date: '2025-02-27T10:00:00Z', dateET: '2025-02-27T02:00:00' },
        practice3: { name: 'Practice 3', date: '2025-02-28T10:00:00Z', dateET: '2025-02-28T02:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-03-14T12:30:00Z', dateET: '2025-03-14T00:00:00' },
        practice2: { name: 'Practice 2', date: '2025-03-14T16:00:00Z', dateET: '2025-03-14T04:00:00' },
        practice3: { name: 'Practice 3', date: '2025-03-15T12:30:00Z', dateET: '2025-03-15T00:00:00' },
        qualifying: { name: 'Qualifying', date: '2025-03-15T16:00:00Z', dateET: '2025-03-15T04:00:00' },
        race: { name: 'Race', date: '2025-03-16T15:00:00Z', dateET: '2025-03-16T00:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-03-21T11:30:00Z', dateET: '2025-03-21T03:00:00' },
        sprint_qualifying: { name: 'Sprint Qualifying', date: '2025-03-21T15:30:00Z', dateET: '2025-03-21T07:00:00' },
        sprint: { name: 'Sprint', date: '2025-03-22T11:00:00Z', dateET: '2025-03-22T03:00:00' },
        qualifying: { name: 'Qualifying', date: '2025-03-22T15:00:00Z', dateET: '2025-03-22T07:00:00' },
        race: { name: 'Race', date: '2025-03-23T15:00:00Z', dateET: '2025-03-23T03:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-04-04T11:30:00Z', dateET: '2025-04-04T01:00:00' },
        practice2: { name: 'Practice 2', date: '2025-04-04T15:00:00Z', dateET: '2025-04-04T04:00:00' },
        practice3: { name: 'Practice 3', date: '2025-04-05T11:30:00Z', dateET: '2025-04-05T01:00:00' },
        qualifying: { name: 'Qualifying', date: '2025-04-05T15:00:00Z', dateET: '2025-04-05T04:00:00' },
        race: { name: 'Race', date: '2025-04-06T14:00:00Z', dateET: '2025-04-06T01:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-04-11T14:30:00Z', dateET: '2025-04-11T11:00:00' },
        practice2: { name: 'Practice 2', date: '2025-04-11T18:00:00Z', dateET: '2025-04-11T14:00:00' },
        practice3: { name: 'Practice 3', date: '2025-04-12T15:30:00Z', dateET: '2025-04-12T11:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-04-12T19:00:00Z', dateET: '2025-04-12T15:00:00' },
        race: { name: 'Race', date: '2025-04-13T18:00:00Z', dateET: '2025-04-13T11:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-04-18T16:30:00Z', dateET: '2025-04-18T13:00:00' },
        practice2: { name: 'Practice 2', date: '2025-04-18T20:00:00Z', dateET: '2025-04-18T16:00:00' },
        practice3: { name: 'Practice 3', date: '2025-04-19T16:30:00Z', dateET: '2025-04-19T13:00:00' },
        qualifying: { name: 'Qualifying', date: '2025-04-19T20:00:00Z', dateET: '2025-04-19T16:00:00' },
        race: { name: 'Race', date: '2025-04-20T20:00:00Z', dateET: '2025-04-20T13:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-05-02T12:30:00Z', dateET: '2025-05-02T16:00:00' },
        sprint_qualifying: { name: 'Sprint Qualifying', date: '2025-05-02T16:30:00Z', dateET: '2025-05-02T20:00:00' },
        sprint: { name: 'Sprint', date: '2025-05-03T12:00:00Z', dateET: '2025-05-03T16:00:00' },
        qualifying: { name: 'Qualifying', date: '2025-05-03T16:00:00Z', dateET: '2025-05-03T20:00:00' },
        race: { name: 'Race', date: '2025-05-04T16:00:00Z', dateET: '2025-05-04T16:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-05-16T13:30:00Z', dateET: '2025-05-16T09:00:00' },
        practice2: { name: 'Practice 2', date: '2025-05-16T17:00:00Z', dateET: '2025-05-16T13:00:00' },
        practice3: { name: 'Practice 3', date: '2025-05-17T12:30:00Z', dateET: '2025-05-17T08:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-05-17T16:00:00Z', dateET: '2025-05-17T12:00:00' },
        race: { name: 'Race', date: '2025-05-18T15:00:00Z', dateET: '2025-05-18T09:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-05-23T13:30:00Z', dateET: '2025-05-23T09:00:00' },
        practice2: { name: 'Practice 2', date: '2025-05-23T17:00:00Z', dateET: '2025-05-23T13:00:00' },
        practice3: { name: 'Practice 3', date: '2025-05-24T12:30:00Z', dateET: '2025-05-24T08:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-05-24T16:00:00Z', dateET: '2025-05-24T12:00:00' },
        race: { name: 'Race', date: '2025-05-25T15:00:00Z', dateET: '2025-05-25T09:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-05-30T13:30:00Z', dateET: '2025-05-30T09:00:00' },
        practice2: { name: 'Practice 2', date: '2025-05-30T17:00:00Z', dateET: '2025-05-30T13:00:00' },
        practice3: { name: 'Practice 3', date: '2025-05-31T12:30:00Z', dateET: '2025-05-31T08:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-05-31T16:00:00Z', dateET: '2025-05-31T12:00:00' },
        race: { name: 'Race', date: '2025-06-01T15:00:00Z', dateET: '2025-06-01T09:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-06-13T13:30:00Z', dateET: '2025-06-13T15:00:00' },
        practice2: { name: 'Practice 2', date: '2025-06-13T17:00:00Z', dateET: '2025-06-13T19:00:00' },
        practice3: { name: 'Practice 3', date: '2025-06-14T12:30:00Z', dateET: '2025-06-14T14:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-06-14T16:00:00Z', dateET: '2025-06-14T18:00:00' },
        race: { name: 'Race', date: '2025-06-15T14:00:00Z', dateET: '2025-06-15T15:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-06-27T13:30:00Z', dateET: '2025-06-27T09:00:00' },
        practice2: { name: 'Practice 2', date: '2025-06-27T17:00:00Z', dateET: '2025-06-27T13:00:00' },
        practice3: { name: 'Practice 3', date: '2025-06-28T12:30:00Z', dateET: '2025-06-28T08:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-06-28T16:00:00Z', dateET: '2025-06-28T12:00:00' },
        race: { name: 'Race', date: '2025-06-29T15:00:00Z', dateET: '2025-06-29T09:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-07-04T12:30:00Z', dateET: '2025-07-04T10:00:00' },
        practice2: { name: 'Practice 2', date: '2025-07-04T16:00:00Z', dateET: '2025-07-04T14:00:00' },
        practice3: { name: 'Practice 3', date: '2025-07-05T11:30:00Z', dateET: '2025-07-05T09:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-07-05T15:00:00Z', dateET: '2025-07-05T13:00:00' },
        race: { name: 'Race', date: '2025-07-06T15:00:00Z', dateET: '2025-07-06T10:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-07-25T12:30:00Z', dateET: '2025-07-25T09:00:00' },
        sprint_qualifying: { name: 'Sprint Qualifying', date: '2025-07-25T16:30:00Z', dateET: '2025-07-25T13:00:00' },
        sprint: { name: 'Sprint', date: '2025-07-26T12:00:00Z', dateET: '2025-07-26T09:00:00' },
        qualifying: { name: 'Qualifying', date: '2025-07-26T16:00:00Z', dateET: '2025-07-26T13:00:00' },
        race: { name: 'Race', date: '2025-07-27T15:00:00Z', dateET: '2025-07-27T09:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-08-01T13:30:00Z', dateET: '2025-08-01T09:00:00' },
        practice2: { name: 'Practice 2', date: '2025-08-01T17:00:00Z', dateET: '2025-08-01T13:00:00' },
        practice3: { name: 'Practice 3', date: '2025-08-02T12:30:00Z', dateET: '2025-08-02T08:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-08-02T16:00:00Z', dateET: '2025-08-02T12:00:00' },
        race: { name: 'Race', date: '2025-08-03T15:00:00Z', dateET: '2025-08-03T09:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-08-29T12:30:00Z', dateET: '2025-08-29T09:00:00' },
        practice2: { name: 'Practice 2', date: '2025-08-29T16:00:00Z', dateET: '2025-08-29T13:00:00' },
        practice3: { name: 'Practice 3', date: '2025-08-30T11:30:00Z', dateET: '2025-08-30T08:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-08-30T15:00:00Z', dateET: '2025-08-30T12:00:00' },
        race: { name: 'Race', date: '2025-08-31T15:00:00Z', dateET: '2025-08-31T09:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-09-05T13:30:00Z', dateET: '2025-09-05T09:00:00' },
        practice2: { name: 'Practice 2', date: '2025-09-05T17:00:00Z', dateET: '2025-09-05T13:00:00' },
        practice3: { name: 'Practice 3', date: '2025-09-06T12:30:00Z', dateET: '2025-09-06T08:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-09-06T16:00:00Z', dateET: '2025-09-06T12:00:00' },
        race: { name: 'Race', date: '2025-09-07T15:00:00Z', dateET: '2025-09-07T09:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-09-19T12:30:00Z', dateET: '2025-09-19T07:00:00' },
        practice2: { name: 'Practice 2', date: '2025-09-19T16:00:00Z', dateET: '2025-09-19T11:00:00' },
        practice3: { name: 'Practice 3', date: '2025-09-20T12:30:00Z', dateET: '2025-09-20T07:00:00' },
        qualifying: { name: 'Qualifying', date: '2025-09-20T16:00:00Z', dateET: '2025-09-20T11:00:00' },
        race: { name: 'Race', date: '2025-09-21T15:00:00Z', dateET: '2025-09-21T07:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-10-03T17:30:00Z', dateET: '2025-10-03T08:00:00' },
        practice2: { name: 'Practice 2', date: '2025-10-03T21:00:00Z', dateET: '2025-10-03T12:00:00' },
        practice3: { name: 'Practice 3', date: '2025-10-04T17:30:00Z', dateET: '2025-10-04T08:00:00' },
        qualifying: { name: 'Qualifying', date: '2025-10-04T21:00:00Z', dateET: '2025-10-04T12:00:00' },
        race: { name: 'Race', date: '2025-10-05T20:00:00Z', dateET: '2025-10-05T08:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-10-17T12:30:00Z', dateET: '2025-10-17T15:00:00' },
        sprint_qualifying: { name: 'Sprint Qualifying', date: '2025-10-17T16:30:00Z', dateET: '2025-10-17T19:00:00' },
        sprint: { name: 'Sprint', date: '2025-10-18T12:00:00Z', dateET: '2025-10-18T15:00:00' },
        qualifying: { name: 'Qualifying', date: '2025-10-18T16:00:00Z', dateET: '2025-10-18T19:00:00' },
        race: { name: 'Race', date: '2025-10-19T14:00:00Z', dateET: '2025-10-19T15:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-10-24T12:30:00Z', dateET: '2025-10-24T16:00:00' },
        practice2: { name: 'Practice 2', date: '2025-10-24T16:00:00Z', dateET: '2025-10-24T20:00:00' },
        practice3: { name: 'Practice 3', date: '2025-10-25T11:30:00Z', dateET: '2025-10-25T15:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-10-25T15:00:00Z', dateET: '2025-10-25T19:00:00' },
        race: { name: 'Race', date: '2025-10-26T14:00:00Z', dateET: '2025-10-26T16:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-11-07T11:30:00Z', dateET: '2025-11-07T12:00:00' },
        sprint_qualifying: { name: 'Sprint Qualifying', date: '2025-11-07T15:30:00Z', dateET: '2025-11-07T16:00:00' },
        sprint: { name: 'Sprint', date: '2025-11-08T11:00:00Z', dateET: '2025-11-08T12:00:00' },
        qualifying: { name: 'Qualifying', date: '2025-11-08T15:00:00Z', dateET: '2025-11-08T16:00:00' },
        race: { name: 'Race', date: '2025-11-09T14:00:00Z', dateET: '2025-11-09T12:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-11-20T16:30:00Z', dateET: '2025-11-20T23:00:00' },
        practice2: { name: 'Practice 2', date: '2025-11-20T20:00:00Z', dateET: '2025-11-21T03:00:00' },
        practice3: { name: 'Practice 3', date: '2025-11-21T16:30:00Z', dateET: '2025-11-21T23:00:00' },
        qualifying: { name: 'Qualifying', date: '2025-11-21T20:00:00Z', dateET: '2025-11-22T03:00:00' },
        race: { name: 'Race', date: '2025-11-22T20:00:00Z', dateET: '2025-11-22T23:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-11-28T16:30:00Z', dateET: '2025-11-28T11:00:00' },
        sprint_qualifying: { name: 'Sprint Qualifying', date: '2025-11-28T20:30:00Z', dateET: '2025-11-28T15:00:00' },
        sprint: { name: 'Sprint', date: '2025-11-29T17:00:00Z', dateET: '2025-11-29T11:00:00' },
        qualifying: { name: 'Qualifying', date: '2025-11-29T21:00:00Z', dateET: '2025-11-29T15:00:00' },
        race: { name: 'Race', date: '2025-11-30T19:00:00Z', dateET: '2025-11-30T11:00:00' }
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
        practice1: { name: 'Practice 1', date: '2025-12-05T13:30:00Z', dateET: '2025-12-05T08:00:00' },
        practice2: { name: 'Practice 2', date: '2025-12-05T17:00:00Z', dateET: '2025-12-05T12:00:00' },
        practice3: { name: 'Practice 3', date: '2025-12-06T14:30:00Z', dateET: '2025-12-06T09:30:00' },
        qualifying: { name: 'Qualifying', date: '2025-12-06T18:00:00Z', dateET: '2025-12-06T13:00:00' },
        race: { name: 'Race', date: '2025-12-07T17:00:00Z', dateET: '2025-12-07T08:00:00' }
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
    practice2: Session;
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