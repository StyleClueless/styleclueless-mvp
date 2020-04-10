-- Table: public.tagging

-- DROP TABLE public.tagging;
CREATE TABLE public.tagging
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    tagging_import_id uuid NOT NULL,
    demography  character varying default NULL,
    class  character varying default NULL,
    design  character varying default NULL,
    shade  character varying default NULL,
    style  character varying default NULL,
    deleted boolean DEFAULT false,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    CONSTRAINT tagging_pkey PRIMARY KEY (id),
    CONSTRAINT tagging_tagging_import_id_fkey FOREIGN KEY (tagging_import_id)
        REFERENCES public.tagging_import (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
    )
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tagging
    OWNER to postgres;

-- Index: index_tagging_on_client_id

-- DROP INDEX public.index_tagging_on_client_id;

--CREATE INDEX index_tagging_on_code
--    ON public.tagging USING btree
--    (code)
--    TABLESPACE pg_default;
