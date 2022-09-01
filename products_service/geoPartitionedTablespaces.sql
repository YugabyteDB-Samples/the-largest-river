CREATE TABLESPACE us_west1_tablespace WITH (
    replica_placement='{"num_replicas": 1, "placement_blocks": [{"cloud": "gcp", "zone": "us-west1-a", "region": "us-west1", "min_num_replicas": 1}]}'
);
CREATE TABLESPACE southamerica_east1_tablespace WITH (
    replica_placement='{"num_replicas": 1, "placement_blocks": [{"cloud": "gcp", "zone": "southamerica-east1-a", "region": "southamerica-east1", "min_num_replicas": 1}]}'
);
CREATE TABLESPACE europe_west2_tablespace WITH (
    replica_placement='{"num_replicas": 1, "placement_blocks": [{"cloud": "gcp", "zone": "europe-west2-c", "region": "europe-west2", "min_num_replicas": 1}]}'
);
CREATE TABLESPACE asia_south1_tablespace WITH (
    replica_placement='{"num_replicas": 1, "placement_blocks": [{"cloud": "gcp", "zone": "asia-south1-c", "region": "asia-south1", "min_num_replicas": 1}]}'
);
CREATE TABLESPACE australia_southeast1_tablespace WITH (
    replica_placement='{"num_replicas": 1, "placement_blocks": [{"cloud": "gcp", "zone": "australia-southeast1-c", "region": "australia-southeast1", "min_num_replicas": 1}]}'
);