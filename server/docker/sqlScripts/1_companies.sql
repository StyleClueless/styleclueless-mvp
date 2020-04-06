-- Table: public.companies

-- DROP TABLE public.companies;

CREATE TABLE public.companies
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    company_name character varying COLLATE pg_catalog."default",
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    logo_url character varying COLLATE pg_catalog."default",

    CONSTRAINT companies_pkey PRIMARY KEY (id),
    CONSTRAINT "UNIQUE_companies" UNIQUE (company_name)

)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.companies
    OWNER to postgres;
