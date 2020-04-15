-- Table: public.tagging

-- DROP TABLE public.tagging;
CREATE TABLE public.tagging
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL,
    sku  character varying default NULL,
    url   character varying NOT NULL,
    s3_url   character varying default NULL,
    demography  character varying default NULL,
    class  character varying default NULL,
    design  character varying default NULL,
    shade  character varying default NULL,
    style  character varying default NULL,
    deleted boolean DEFAULT false,
    imported_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    CONSTRAINT tagging_pkey PRIMARY KEY (id),
    CONSTRAINT tagging_company_id_fkey FOREIGN KEY (company_id)
        REFERENCES public.companies (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
    )
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tagging
    OWNER to postgres;

CREATE UNIQUE INDEX index_tagging_on_company_id_sku
    ON public.tagging USING btree
    (company_id,sku)
    TABLESPACE pg_default;

