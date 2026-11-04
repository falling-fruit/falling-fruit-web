export interface paths {
  "/clusters": {
    get: {
      parameters: {
        query: {
          /** The southwest and northeast corners of the bounding box in WGS84 decimal degrees, in the format `swlat,swlng|nelat,nelng`. Latitude must be in the interval [-85.0511, 85.0511] and longitude must be in the interval [-180, 180]. */
          bounds: components["parameters"]["bounds"];
          /** Zoom level, where the world is divided into a 2<sup>zoom</sup> x 2<sup>zoom</sup> grid. */
          zoom?: components["parameters"]["zoom"];
          /** Whether to include Locations imported from municipal tree inventories. */
          muni?: components["parameters"]["muni"];
          /** IDs of Types to include (all by default). */
          types?: components["parameters"]["types"];
        };
      };
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["Cluster"][];
          };
        };
      };
    };
  };
  "/imports": {
    get: {
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["Import"][];
          };
        };
      };
    };
  };
  "/imports/{id}": {
    get: {
      parameters: {
        path: {
          /** Import ID. */
          id: components["parameters"]["import_id"];
        };
      };
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["Import"];
          };
        };
      };
    };
  };
  "/users/{id}": {
    get: {
      parameters: {
        path: {
          /** User ID. */
          id: components["parameters"]["user_id"];
        };
      };
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["User"];
          };
        };
      };
    };
  };
  "/locations": {
    get: {
      parameters: {
        query: {
          /** The southwest and northeast corners of the bounding box in WGS84 decimal degrees, in the format `swlat,swlng|nelat,nelng`. Latitude must be in the interval [-85.0511, 85.0511] and longitude must be in the interval [-180, 180]. */
          bounds: components["parameters"]["bounds"];
          /** Whether to include Locations imported from municipal tree inventories. */
          muni?: components["parameters"]["muni"];
          /** IDs of Types to include (all by default). */
          types?: components["parameters"]["types"];
          /** Whether to only return Locations with Types locally flagged as invasive species. Note that this parameter is not supported for filtering clusters. */
          invasive?: components["parameters"]["invasive"];
          /** Maximum number of Locations to return. */
          limit?: number;
          /** Offset from which to apply `limit`. */
          offset?: number;
          /** Center `latitude,longitude` in WGS84 decimal degrees. If provided, Locations are returned in order of increasing distance and the distance to each Location is returned. Longitude must be in the interval [-180, 180] and latitude in the interval [-90, 90]. */
          center?: number[];
          /** Whether to include the path to a review photo thumbnail, if available. */
          photo?: boolean;
        };
      };
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["ListLocation"][];
          };
        };
      };
    };
    /** A `review` can be included, in which case the result includes the `reviews` property. */
    post: {
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["Location"];
          };
        };
      };
      requestBody: {
        content: {
          "application/json": components["schemas"]["AddLocation"];
        };
      };
    };
  };
  "/locations/count": {
    get: {
      parameters: {
        query: {
          /** The southwest and northeast corners of the bounding box in WGS84 decimal degrees, in the format `swlat,swlng|nelat,nelng`. Latitude must be in the interval [-85.0511, 85.0511] and longitude must be in the interval [-180, 180]. */
          bounds: components["parameters"]["bounds"];
          /** Whether to include Locations imported from municipal tree inventories. */
          muni?: components["parameters"]["muni"];
          /** IDs of Types to include (all by default). */
          types?: components["parameters"]["types"];
          /** Whether to only return Locations with Types locally flagged as invasive species. Note that this parameter is not supported for filtering clusters. */
          invasive?: components["parameters"]["invasive"];
        };
      };
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": number;
          };
        };
      };
    };
  };
  "/locations/lists": {
    get: {
      parameters: {
        query: {
          /**
           * Additional information to include.
           * - locations: List locations.
           */
          embed?: ("locations");
        };
      };
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["LocationList"][];
          };
        };
      };
    };
    post: {
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["LocationList"];
          };
        };
      };
      requestBody: {
        content: {
          "application/json": components["schemas"]["EditLocationList"];
        };
      };
    };
  };
  "/locations/lists/{list_id}": {
    get: {
      parameters: {
        path: {
          /** Location List ID. */
          list_id: components["parameters"]["location_list_id"];
        };
        query: {
          /**
           * Additional information to include.
           * - locations: List locations.
           */
          embed?: ("locations")[];
        };
      };
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["LocationList"];
          };
        };
      };
    };
    put: {
      parameters: {
        path: {
          /** Location List ID. */
          list_id: components["parameters"]["location_list_id"];
        };
      };
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["LocationList"];
          };
        };
      };
      requestBody: {
        content: {
          "application/json": components["schemas"]["EditLocationList"];
        };
      };
    };
    delete: {
      parameters: {
        path: {
          /** Location List ID. */
          list_id: components["parameters"]["location_list_id"];
        };
      };
      responses: {
        /** Success */
        200: never;
      };
    };
  };
  "/locations/{id}": {
    get: {
      parameters: {
        path: {
          /** Location ID. */
          id: components["parameters"]["location_id"];
        };
        query: {
          /**
           * Additional information to include.
           * - reviews: Location reviews.
           * - import: Imported dataset.
           */
          embed?: ("reviews" | "import")[];
        };
      };
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["Location"];
          };
        };
      };
    };
    put: {
      parameters: {
        path: {
          /** Location ID. */
          id: components["parameters"]["location_id"];
        };
      };
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["Location"];
          };
        };
      };
      requestBody: {
        content: {
          "application/json": components["schemas"]["EditLocation"];
        };
      };
    };
  };
  "/locations/{id}/lists/{list_id}": {
    post: {
      parameters: {
        path: {
          /** Location ID. */
          id: components["parameters"]["location_id"];
          /** Location List ID. */
          list_id: components["parameters"]["location_list_id"];
        };
      };
      responses: {
        /** Success */
        204: never;
      };
    };
    delete: {
      parameters: {
        path: {
          /** Location ID. */
          id: components["parameters"]["location_id"];
          /** Location List ID. */
          list_id: components["parameters"]["location_list_id"];
        };
      };
      responses: {
        /** Success */
        204: never;
      };
    };
  };
  "/locations/{id}/reviews": {
    get: {
      parameters: {
        path: {
          /** Location ID. */
          id: components["parameters"]["location_id"];
        };
      };
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["Review"];
          };
        };
      };
    };
    post: {
      parameters: {
        path: {
          /** Location ID. */
          id: components["parameters"]["location_id"];
        };
      };
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["Review"];
          };
        };
      };
      requestBody: {
        content: {
          "application/json": components["schemas"]["EditReview"];
        };
      };
    };
  };
  "/locations/changes": {
    get: {
      parameters: {
        query: {
          /**
           * Earliest UTC datetime of change (inclusive).
           * @example 2024-11-09T00:00:00Z
           */
          earliest?: string;
          /**
           * Latest UTC datetime of change (exclusive).
           */
          latest?: string;
          /** @description User ID of changes to return. */
          user_id?: number;
          /**
           * Whether to filter changes within the foraging range of the user with `user_id`, rather than by the user.
           */
          range?: boolean;
        };
      };
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["LocationChange"][];
          };
        };
      };
    };
  };
  "/photos": {
    post: {
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["Photo"];
          };
        };
      };
      requestBody: {
        content: {
          "multipart/form-data": {
            /** File to upload (jpeg, png, webp, gif, or svg). Images are converted to jpeg and resized as needed to a maximum dimension of 2048 pixels. */
            file: string;
          };
        };
      };
    };
  };
  "/reviews/{id}": {
    get: {
      parameters: {
        path: {
          /** Review ID. */
          id: components["parameters"]["review_id"];
        };
      };
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["Review"];
          };
        };
      };
    };
    put: {
      parameters: {
        path: {
          /** Review ID. */
          id: components["parameters"]["review_id"];
        };
      };
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["Review"];
          };
        };
      };
      requestBody: {
        content: {
          "application/json": components["schemas"]["EditReview"];
        };
      };
    };
  };
  "/types": {
    get: {
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["Type"][];
          };
        };
      };
    };
    post: {
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["Type"][];
          };
        };
      };
      requestBody: {
        content: {
          "application/json": components["schemas"]["SubmitType"];
        };
      };
    };
  };
  "/types/{id}": {
    get: {
      parameters: {
        path: {
          /** Type ID. */
          id: components["parameters"]["type_id"];
        };
      };
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["Type"];
          };
        };
      };
    };
  };
  "/types/counts": {
    get: {
      parameters: {
        query: {
          /** The southwest and northeast corners of the bounding box in WGS84 decimal degrees, in the format `swlat,swlng|nelat,nelng`. Latitude must be in the interval [-85.0511, 85.0511] and longitude must be in the interval [-180, 180]. */
          bounds: components["parameters"]["bounds"];
          /** Whether to include Locations imported from municipal tree inventories. */
          muni?: components["parameters"]["muni"];
        };
      };
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["TypeCount"][];
          };
        };
      };
    };
  };
  "/reports": {
    post: {
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["Report"];
          };
        };
      };
      requestBody: {
        content: {
          "application/json": components["schemas"]["EditReport"];
        };
      };
    };
  };
  "/reports/open": {
    /** List all unresolved Reports of problems with Locations, with full details. Not paginated. Admin only. */
    get: {
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["AdminReport"][];
          };
        };
      };
    };
  };
  "/reports/resolved": {
    /** List resolved Reports of problems with Locations, with full details including how each was resolved. Supports free-text search, filtering by problem and resolution code, sorting by resolution date, and pagination. Admin only. */
    get: {
      parameters: {
        query: {
          /** Free-text search matched (case-insensitively) against the report comment, resolution response, and reporter name and email. */
          q?: components["parameters"]["report_search"];
          /** Only return Reports with this problem code. */
          problem_code?: components["parameters"]["report_problem_code"];
          /** Only return Reports resolved with this resolution code. */
          resolution_code?: components["parameters"]["report_resolution_code"];
          /**
           * Sort order by resolution date.
           * - `newest`: Most recently resolved first.
           * - `oldest`: Least recently resolved first.
           */
          sort?: components["parameters"]["report_sort"];
          /** Maximum number of results to return. */
          limit?: components["parameters"]["limit"];
          /** Offset from which to apply `limit`. */
          offset?: components["parameters"]["offset"];
        };
      };
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["ResolvedReport"][];
          };
        };
      };
    };
  };
  "/reports/resolution": {
    /** Resolve one or more Reports by applying a single action, transactionally. Admin only. If `notify_reporters` is true, each distinct reporter is emailed once about all of their resolved Reports. Sending is best-effort: a failed email does not roll back the resolution or stop other emails. The response reports which notifications were sent and which failed. */
    post: {
      parameters: {
        query: {
          /** Whether to email the reporters about the resolution. */
          notify_reporters?: components["parameters"]["notify_reporters"];
        };
      };
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["ReportResolutionResult"];
          };
        };
      };
      requestBody: {
        content: {
          "application/json": components["schemas"]["ReportBatchResolution"];
        };
      };
    };
  };
  "/user": {
    get: {
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["User"];
          };
        };
      };
    };
    /**
     * - If a new email is provided, it is staged as unconfirmed (`unconfirmed_email`) and a confirmation email is sent to the new email. The previous email is replaced only once the new email is confirmed.
     * - If a password is provided, it takes immediate effect. If it does not match the previous password, all refresh tokens not corresponding to the current access token are revoked.
     * - In either case, the existing password is required (`password_confirmation`).
     */
    put: {
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["User"];
          };
        };
      };
      requestBody: {
        content: {
          "application/json": {
            name: components["schemas"]["EditUser"]["name"];
            email: components["schemas"]["User"]["email"];
            /** Password. */
            password?: string;
            /** Current password. Required for email and password change. */
            password_confirmation?: string;
          };
        };
      };
    };
    /**
     * When first created, the account is not confirmed and cannot be used.
     * An email is sent with a link that must be clicked to confirm the account.
     *
     * `email` cannot match (case-insensitive) the email of an existing user.
     */
    post: {
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": {
              message?: string;
            };
          };
        };
      };
      requestBody: {
        content: {
          "application/json": {
            email: components["schemas"]["User"]["email"];
            password: paths["/user"]["put"]["requestBody"]["content"]["application/json"]["password"];
            name?: components["schemas"]["EditUser"]["name"];
          };
        };
      };
    };
    delete: {
      responses: {
        /** Success (no content) */
        204: never;
      };
    };
  };
  "/user/confirmation": {
    get: {
      parameters: {
        query: {
          /** Email-confirmation token. */
          token: string;
        };
      };
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": {
              message?: string;
            };
          };
        };
      };
    };
    post: {
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": {
              email: components["schemas"]["User"]["email"];
            };
          };
        };
      };
      requestBody: {
        content: {
          "application/json": {
            /** Email-confirmation token. */
            token: string;
          };
        };
      };
    };
  };
  "/user/confirmation/retry": {
    post: {
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": {
              message?: string;
            };
          };
        };
      };
      requestBody: {
        content: {
          "application/json": {
            email: components["schemas"]["User"]["email"];
          };
        };
      };
    };
  };
  "/user/token": {
    /** Follows the OAuth2 spec for password flow, which requires form data with `username` and `password`. */
    post: {
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["Token"];
          };
        };
      };
      requestBody: {
        content: {
          "multipart/form-data": {
            username: components["schemas"]["User"]["email"];
            password: paths["/user"]["put"]["requestBody"]["content"]["application/json"]["password"];
          };
        };
      };
    };
  };
  "/user/token/refresh": {
    /** Follows the OAuth2 spec for refresh token flow, which requires form data with `grant_type: 'refresh_token'` (ignored) and `refresh_token`. */
    post: {
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": components["schemas"]["Token"];
          };
        };
      };
      requestBody: {
        content: {
          "multipart/form-data": {
            /** Refresh token. */
            refresh_token: string;
            /** Grant type. */
            grant_type?: "refresh_token";
          };
        };
      };
    };
  };
  "/user/password": {
    put: {
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": {
              email?: components["schemas"]["User"]["email"];
            };
          };
        };
      };
      requestBody: {
        content: {
          "application/json": {
            /** Password-reset token. */
            token: string;
            password: paths["/user"]["put"]["requestBody"]["content"]["application/json"]["password"];
          };
        };
      };
    };
  };
  "/user/password/reset": {
    post: {
      responses: {
        /** Success */
        200: {
          content: {
            "application/json": {
              message?: string;
            };
          };
        };
      };
      requestBody: {
        content: {
          "application/json": {
            email: components["schemas"]["User"]["email"];
          };
        };
      };
    };
  };
}

export interface components {
  schemas: {
    IdField: {
      /** Unique identifier. */
      id: number;
    };
    LatLngFields: {
      /** Latitude in WGS84 decimal degrees. */
      lat?: number;
      /** Longitude in WGS84 decimal degrees. */
      lng?: number;
    };
    DateFields: {
      /** Date and time created in format YYYY-MM-DDThh:mm:ss.sssZ. */
      created_at: string;
      /** Date and time last updated in format YYYY-MM-DDThh:mm:ss.sssZ. */
      updated_at: string;
    };
    /** Number of Locations in an area. */
    Cluster: components["schemas"]["LatLngFields"] & {
      /** Number of Locations. Locations with multiple Types are counted as their number of Types. */
      count: number;
    };
    /** Number of Location Types in an area. */
    TypeCount: {
      /** Type ID. */
      id: number;
      /** Number of Locations with that Type ID. */
      count: number;
    };
    /** Type properties that can be edited. */
    BaseType: {
      /** Type ID of taxonomic parent. */
      parent_id?: number | null;
      /** Whether pending admin review. This is always true unless set to false by an admin (not implemented). */
      pending?: boolean;
      /**
       * Scientific names, starting with the preferred synonym.
       * - Genus (or higher rank): Prunus
       * - Subgenus: Prunus subg. Amygdalus
       * - Species: Prunus domestica
       * - Subspecies: Prunus domestica subsp. domestica, Prunus persica var. nucipersica, Brassica oleracea var. capitata f. rubra
       * - Hybrid: Prunus x eminens, Prunus cerasus x Prunus fruticosa
       * - Cultivar: Prunus persica 'George IV', Prunus domestica subsp. domestica 'Italian', Acer truncatum x platanoides 'Keithsform'
       */
      scientific_names?: string[];
      /**
       * Taxonomic rank.
       * - 0: Polyphyletic
       * - 1: Kingdom
       * - 2: Phylum
       * - 3: Class
       * - 4: Order
       * - 5: Family
       * - 6: Genus
       * - 7: Multispecies
       * - 8: Species
       * - 9: Subspecies
       */
      taxonomic_rank?: number | null;
      /** Common names, starting with the preferred synonym, by language code (e.g. `en`) and optional region code (e.g. `en_us`). Currently, only `en` can be set. */
      common_names?: { [key: string]: string[] };
      /**Categories associated with the type */
      categories?: string[];
    };
    /** Type properties that can be submitted. At least one name (in `common_names.en` or `scientific_names`) is required. */
    SubmitType: components["schemas"]["BaseType"] & {
      /** Submission notes. */
      notes?: string | null;
    };
    /** All Type properties. */
    Type: components["schemas"]["IdField"] &
      components["schemas"]["DateFields"] &
      components["schemas"]["BaseType"] & {
        /**
         * Links to more information, by resource code.
         * - wikipedia: English Wikipedia (https://en.wikipedirg)
         * - eat_the_weeds: Eat the Weeds (https://www.eattheweeds.com)
         * - foraging_texas: Foraging Texas (https://www.foragingtexas.com)
         * - urban_mushrooms: Urban Mushrooms (http://urbanmushrooms.com)
         * - fruitipedia: Fruitipedia (http://www.fruitipedia.com)
         * - usda: USDA Plants Database (https://plants.usda.gov)
         */
        urls: { [key: string]: string };
      };
    ListLocation: components["schemas"]["IdField"] &
      components["schemas"]["LatLngFields"] & {
        /** Type IDs. */
        type_ids: number[];
        /** Whether the Location is in any of the current user's lists. Only included if the user is authenticated. */
        in_list?: boolean;
        /** Distance in meters from provided centerpoint. */
        distance?: number;
        /** Path to review photo thumbnail, if available. */
        photo?: { [key: string]: any };
      };
    /** Location properties that can be edited. */
    EditLocation: components["schemas"]["LatLngFields"] & {
      /** Type IDs. */
      type_ids: number[];
      /** Whether suspected to be wrong in some way and requires verification. */
      unverified?: boolean;
      /**
       * Access level.
       * - 0: Location is on my property.
       * - 1: I have permission from the owner to add this Location.
       * - 2: Location is on public land.
       * - 3: Location is on private property but overhangs public property.
       * - 4: Location is on private property.
       */
      access?: (0 | 1 | 2 | 3 | 4) | null;
      /** Description. */
      description?: string | null;
      /** First month in season (zero-based). */
      season_start?: number;
      /** Last month in season (zero-based). */
      season_stop?: number;
    };
    /** Location properties that can be edited when resolving Reports. All fields are optional. */
    PatchLocation: components["schemas"]["LatLngFields"] & {
      /** Type IDs. */
      type_ids?: number[];
      /** Whether suspected to be wrong in some way and requires verification. */
      unverified?: boolean;
      /** Whether hidden from public map tiles, clusters, and search results. Only an admin can set this to `true` or change its value. */
      hidden?: boolean;
      /**
       * Access level.
       * - 0: Location is on my property.
       * - 1: I have permission from the owner to add this Location.
       * - 2: Location is on public land.
       * - 3: Location is on private property but overhangs public property.
       * - 4: Location is on private property.
       */
      access?: (0 | 1 | 2 | 3 | 4) | null;
      /** Description. */
      description?: string | null;
      /** First month in season (zero-based). */
      season_start?: number | null;
      /** Last month in season (zero-based). */
      season_stop?: number | null;
    };
    /** Location properties that can be added. */
    AddLocation: components["schemas"]["EditLocation"] & {
      review?: components["schemas"]["EditReview"];
    };
    /** All Location properties. */
    Location: components["schemas"]["IdField"] &
      components["schemas"]["EditLocation"] &
      components["schemas"]["DateFields"] & {
        /** Author name. Either a hardcoded `author` or the current `name` of the associated User. */
        author: string | null;
        /** Address. Either provided for imported locations whose coordinates had to be geocoded from the address or reverse-geocoded from coordinates. */
        address: string | null;
        /** City (reverse-geocoded from coordinates). */
        city: string | null;
        /** State (reverse-geocoded from coordinates). */
        state: string | null;
        /** County (reverse-geocoded from coordinates). */
        country: string | null;
        /** Whether imported from a municipal tree inventory. */
        muni: boolean;
        /** Import ID. */
        import_id?: number | null;
        import?: components["schemas"]["Import"];
        /** Location reviews. */
        reviews?: components["schemas"]["Review"][];
        /** User's lists that include the Location. */
        lists?: components["schemas"]["LocationList"][];
        /** Unresolved reports of problems with the Location. Empty if there are none. */
        open_reports: components["schemas"]["OpenReport"][];
      };
    LocationChange: {
      /** Time of the change creation */
      created_at: string;
      /** Description of the change (e.g., added, updated, deleted) */
      description: string;
      /** Location ID */
      location_id: number;
      /** Latitude */
      lat: number;
      /**Longitude*/
      lng: number;
      /** Array of type IDs */
      type_ids: number[];
      /** Review ID */
      review_id: number;
      /** User ID */
      user_id: number;
      /** Author's name */
      author: string;
      /** City */
      city: string;
      /** State */
      state: string;
      /** Country */
      country: string;
    };
    /** Location List properties that can be edited. */
    EditLocationList: {
      /** Name. */
      name: string;
      /** Description. */
      description?: string | null;
    };
    /** List of saved locations. */
    LocationList: components["schemas"]["IdField"] &
      components["schemas"]["DateFields"] &
      components["schemas"]["EditLocationList"] & {
        /** User ID. */
        user_id: number;
        /** Locations in the list, in order of addition or, for legacy routes, custom arbitrary order. */
        locations?: components["schemas"]["LocationListLocation"][];
      };
    /** Summary of the reported Location, in the same shape used to display a saved location in a Location List. */
    ReportLocation: components["schemas"]["IdField"] &
      components["schemas"]["LatLngFields"] & {
        /** Type IDs. */
        type_ids: number[];
        /** Address. */
        address?: string | null;
      };
    /** Location in a Location List. */
    LocationListLocation: components["schemas"]["ReportLocation"] & {
      /** Date and time added to list, in format YYYY-MM-DDThh:mm:ss.sssZ. */
      added_at: string;
    };
    BaseReview: {
      /** Comment. */
      comment?: string | null;
      /** Date visited in format YYYY-MM-DD. */
      observed_on?: string | null;
      /** Fruiting status. */
      fruiting?: (0 | 1 | 2) | null;
      /** Quality rating. */
      quality_rating?: (0 | 1 | 2 | 3 | 4) | null;
      /** Yield rating. */
      yield_rating?: (0 | 1 | 2 | 3 | 4) | null;
    };
    /** Review properties that can be edited. */
    EditReview: components["schemas"]["BaseReview"] & {
      /** IDs of photos to link to the review. Previously linked photos are unlinked if their ids are omitted. Photos are ordered by the order of their ids. */
      photo_ids?: number[];
    };
    /** Observations of and opinions about a Location. */
    Review: components["schemas"]["IdField"] &
      components["schemas"]["BaseReview"] &
      components["schemas"]["DateFields"] & {
        /** Location ID. */
        location_id: number;
        /** User ID. */
        user_id: number | null;
        /** Author name. Either a hardcoded `author` or the current `name` of the associated User. */
        author: string | null;
        photos: components["schemas"]["Photo"][];
      };
    /** Location photo. */
    Photo: {
      /** Photo ID. */
      id: number;
      /** Path to thumbnail (longest dimension <= 100 px). */
      thumb: string;
      /** Path to medium size file (longest dimension <= 300 px). */
      medium: string;
      /** Path to large size file (longest dimension <= 2048 px). */
      original: string;
    };
    EditUser: {
      /** Display name. */
      name: string | null;
    };
    User: components["schemas"]["IdField"] &
      components["schemas"]["DateFields"] &
      components["schemas"]["EditUser"] & {
        /** Email. */
        email: string;
        /** Date and time confirmed in format YYYY-MM-DDThh:mm:ss.sssZ. */
        confirmed_at: string | null;
        /**
         * Roles.
         * - user: Regular user.
         * - admin: Administrator.
         */
        roles: ("user" | "admin")[];
        /** Email change pending confirmation. */
        unconfirmed_email?: string;
      };
    /** An unresolved Report of a problem with a Location. Fields beyond `created_at` and `problem_code` are only included for admins (`comment`, `reporter`). */
    OpenReport: {
      /** Report ID. Only included for an authenticated admin. */
      id?: number;
      /** Date and time created in format YYYY-MM-DDThh:mm:ss.sssZ. */
      created_at: string;
      /**
       * Problem code.
       * - 0: Location is spam
       * - 1: Location does not exist
       * - 2: Location is a duplicate
       * - 3: Inappropriate review photo
       * - 4: Inappropriate review comment
       * - 5: Other (explain below)
       */
      problem_code: 0 | 1 | 2 | 3 | 4 | 5;
      /** Comment. Only included for an authenticated admin. */
      comment?: string | null;
      /** Reporter details. Only included for an authenticated admin. */
      reporter?: {
        /** ID of reporting User (if authenticated). */
        user_id: number | null;
        /** Name of the reporter. */
        name: string | null;
        /** Email of the reporter. */
        email: string | null;
      };
    };
    /** Report properties that can be edited. */
    EditReport: {
      /** Location ID. */
      location_id: number;
      /**
       * Problem code.
       * - 0: Location is spam
       * - 1: Location does not exist
       * - 2: Location is a duplicate
       * - 3: Inappropriate review photo
       * - 4: Inappropriate review comment
       * - 5: Other (explain below)
       */
      problem_code: 0 | 1 | 2 | 3 | 4 | 5;
      /** Comment. */
      comment?: string | null;
      /** Email to use for correspondence. If authenticated, defaults to the user's email. Otherwise, it is required. */
      email?: string;
      /** Name to use for correspondence. If authenticated, defaults to the user's name. */
      name?: string | null;
    };
    /** Report of a problem with a Location. */
    Report: components["schemas"]["IdField"] &
      components["schemas"]["EditReport"] &
      components["schemas"]["DateFields"] & {
        /** ID of reporting User (if authenticated). */
        reporter_id?: number | null;
        /**
         * Resolution code.
         * - 0: Made no changes
         * - 1: Edited the location
         * - 2: Deleted the location
         * - 3: Deleted the photo
         * - 4: Deleted the review
         * - 5: Hid the location
         */
        resolution_code?: (0 | 1 | 2 | 3 | 4 | 5) | null;
        /** Response comment. */
        response?: string | null;
        /** ID of responding User. */
        responder_id?: number | null;
      };
    /** How a Report was resolved. */
    ReportResolution: {
      /**
       * Resolution code.
       * - 0: Made no changes
       * - 1: Edited the location
       * - 2: Deleted the location
       * - 3: Deleted the photo
       * - 4: Deleted the review
       * - 5: Hid the location
       */
      code: 0 | 1 | 2 | 3 | 4 | 5;
      /** Response comment. */
      response?: string | null;
      /** The admin who resolved the Report. */
      responder: {
        /** ID of the responding admin. */
        id: number;
        /** Name of the responding admin. */
        name: string | null;
      };
    };
    /**
     * The action to perform when resolving Reports, discriminated by `code`.
     * - 0: Made no changes (records the resolution only).
     * - 1: Edited the location (requires `location`; single Location only).
     * - 2: Deleted the location.
     * - 3: Deleted the photo (requires `photo_id` belonging to the reported Location).
     * - 4: Deleted the review (requires `review_id` belonging to the reported Location).
     * - 5: Hid the location.
     */
    ResolutionAction:
      | {
          code: 0;
          /** Response comment recorded on each resolved Report. */
          response?: string | null;
        }
      | {
          code: 1;
          /** Response comment recorded on each resolved Report. */
          response?: string | null;
          /** Fields to edit on the reported Location. All resolved Reports must target the same Location. */
          location: components["schemas"]["PatchLocation"];
        }
      | {
          code: 2;
          /** Response comment recorded on each resolved Report. */
          response?: string | null;
        }
      | {
          code: 3;
          /** Response comment recorded on each resolved Report. */
          response?: string | null;
          /** ID of the photo to delete. Its review must belong to the reported Location. */
          photo_id: number;
        }
      | {
          code: 4;
          /** Response comment recorded on each resolved Report. */
          response?: string | null;
          /** IDs of the reviews to delete. Each must belong to the reported Location. */
          review_ids: number[];
        }
      | {
          code: 5;
          /** Response comment recorded on each resolved Report. */
          response?: string | null;
        };
    /** Resolve one or more Reports by applying a single action. Location-wide actions (delete, hide) apply once per distinct reported Location; target-specific actions (edit, delete photo, delete review) require the Reports to resolve to a single Location. */
    ReportBatchResolution: {
      /** IDs of the open Reports to resolve with this action. */
      report_ids: number[];
      resolution: components["schemas"]["ResolutionAction"];
    };
    /** An open Report of a problem with a Location, with full details for admins. */
    AdminReport: components["schemas"]["IdField"] & {
      /** Date and time created in format YYYY-MM-DDThh:mm:ss.sssZ. */
      created_at: string;
      /** Summary of the reported Location, including its ID, for display in a table. Null if the Location was since deleted. */
      location: components["schemas"]["ReportLocation"] | null;
      /**
       * Problem code.
       * - 0: Location is spam
       * - 1: Location does not exist
       * - 2: Location is a duplicate
       * - 3: Inappropriate review photo
       * - 4: Inappropriate review comment
       * - 5: Other (explain below)
       */
      problem_code: 0 | 1 | 2 | 3 | 4 | 5;
      /** Comment. */
      comment: string | null;
      /** Reporter details. */
      reporter: {
        /** ID of reporting User (if authenticated). */
        user_id: number | null;
        /** Name of the reporter. */
        name: string | null;
        /** Email of the reporter. */
        email: string | null;
      };
    };
    /** A resolved Report of a problem with a Location, with full details for admins. */
    ResolvedReport: components["schemas"]["AdminReport"] & {
      /** Date and time resolved in format YYYY-MM-DDThh:mm:ss.sssZ. */
      resolved_at: string;
      /** How the Report was resolved. */
      resolution: components["schemas"]["ReportResolution"];
    };
    /** The result of resolving one or more Reports: the resolved Reports and the per-recipient outcome of any reporter notifications. */
    ReportResolutionResult: {
      /** The Reports that were resolved by this action. */
      resolved: components["schemas"]["Report"][];
      /** Outcome of reporter notifications. Both lists are empty unless `notify_reporters` was true. */
      emails: {
        /** Reporter emails that were notified successfully. Empty unless `notify_reporters` was true. */
        sent: string[];
        /** Reporter notifications that failed to send. Resolution still succeeded; sending is best-effort. */
        failed: {
          /** Reporter email that could not be notified. */
          email: string;
          /** Why the notification failed. */
          error: string;
        }[];
      };
    };
    /** Imported dataset. */
    Import: components["schemas"]["IdField"] &
      components["schemas"]["DateFields"] & {
        /** Name. */
        name: string;
        /** Path to a description of the data. */
        url: string | null;
        /** Description and import comments. */
        comments: string | null;
        /** License. */
        license: string | null;
        /** Whether a municipal or university tree inventory. */
        muni: boolean;
        /** Number of imported locations. */
        location_count: number;
      };
    Token: {
      /** Access token. */
      access_token: string;
      /** Token type. */
      token_type: "bearer";
      /** Seconds until the access token expires. It may expire earlier if revoked. */
      expires_in: number;
      /** Refresh token. */
      refresh_token: string;
    };
  };
  parameters: {
    /** The southwest and northeast corners of the bounding box in WGS84 decimal degrees, in the format `swlat,swlng|nelat,nelng`. Latitude must be in the interval [-85.0511, 85.0511] and longitude must be in the interval [-180, 180]. */
    bounds: number[][];
    /** Zoom level, where the world is divided into a 2<sup>zoom</sup> x 2<sup>zoom</sup> grid. */
    zoom: number;
    /** Whether to include Locations imported from municipal tree inventories. */
    muni: boolean;
    /** IDs of Types to include (all by default). */
    types: number[];
    /** Whether to only return Locations with Types locally flagged as invasive species. Note that this parameter is not supported for filtering clusters. */
    invasive: boolean;
    /** Location ID. */
    location_id: number;
    /** Location List ID. */
    location_list_id: number;
    /** Type ID. */
    type_id: number;
    /** Review ID. */
    review_id: number;
    /** User ID. */
    user_id: number;
    /** Import ID. */
    import_id: number;
    /** Report ID. */
    report_id: number;
    /** Whether to email the reporters about the resolution. */
    notify_reporters: boolean;
    /** Maximum number of results to return. */
    limit: number;
    /** Offset from which to apply `limit`. */
    offset: number;
    /** Free-text search matched (case-insensitively) against the report comment, resolution response, and reporter name and email. */
    report_search: string;
    /** Only return Reports with this problem code. */
    report_problem_code: number;
    /** Only return Reports resolved with this resolution code. */
    report_resolution_code: number;
    /**
     * Sort order by resolution date.
     * - `newest`: Most recently resolved first.
     * - `oldest`: Least recently resolved first.
     */
    report_sort: "newest" | "oldest";
  };
}
