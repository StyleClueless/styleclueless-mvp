-- Table: public.tagging

-- DROP TABLE public.tagging;
CREATE TABLE public.tagging_import
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL,
    sku  character varying default NULL,
    url   character varying NOT NULL,
    s3_url   character varying default NULL,
    type  character varying default NULL,
    gender  character varying default NULL,
    deleted boolean DEFAULT false,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    CONSTRAINT tagging_import_pkey PRIMARY KEY (id),
    CONSTRAINT tagging_import_company_id_fkey FOREIGN KEY (company_id)
        REFERENCES public.companies (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tagging_import
    OWNER to postgres;

-- Index: index_tagging_on_client_id

-- DROP INDEX public.index_tagging_on_client_id;

CREATE UNIQUE INDEX index_tagging_import_on_company_id_sku
    ON public.tagging_import USING btree
    (company_id,sku)
    TABLESPACE pg_default;
