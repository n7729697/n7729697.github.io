---
title: Category Theory for Programmers - From Composition to Monads
tags: [category theory, functional programming, monads, functors]
style: fill
color: light
description: Reading notes for the Uppsala University Category Theory for Programmers reading group, following Milewski's book from function composition, types, and Kleisli arrows through products, functors, natural transformations, Yoneda, adjunctions, and monads, with worked Haskell examples and exercises.
---

_These are my reading notes from the **Category Theory for Programmers** reading group at **Uppsala University** ([uu-ctfp.github.io](https://uu-ctfp.github.io/)), which follows Bartosz Milewski's book of the same name. The group read chapters 1-10 in order and then jumped to the monad chapters 20-22; I have filled the gap with the parts of chapters 11-18 that the monad chapters actually depend on._

## How to Read These Notes

Category theory has a reputation for being abstract. For a programmer, it is better described as **the mathematics of composition**: what can we say about a system if all we know is how its pieces plug together? The book, and these notes, answer that question in small steps. Every abstraction is introduced only after a concrete Haskell example has made the need for it obvious.

The notes are organized as a course: each section starts from the simplest example I know, builds the definition, checks the laws by hand, and ends with a short "what to remember" list. Exercises are scattered through the text; most take a few minutes and are worth doing with a pencil or GHCi.

You need only basic Haskell: function types `a -> b`, tuples `(a, b)`, data declarations, pattern matching, and type classes. When something less common appears (rank-N types, type families), I explain it in place.

### Reading Map

| Section in these notes | Milewski chapters | Main idea |
|---|---|---|
| 1. Composition | 1 | A category is a world of composable arrows |
| 2. Types and functions | 2 | Types as sets, pure functions as arrows |
| 3. Categories great and small | 3 | Orders, monoids, and free categories are categories too |
| 4. Kleisli categories | 4 | Effects change *how* arrows compose |
| 5. Universal constructions | 5 | Initial/terminal objects, products, coproducts |
| 6. Algebraic data types | 6 | Types form a semiring |
| 7. Functors | 7 | Structure-preserving maps between categories |
| 8. Functoriality | 8 | Bifunctors, contravariance, profunctors |
| 9. Function types | 9 | Exponentials, currying, Curry-Howard |
| 10. Natural transformations | 10 | Uniform maps between functors |
| 11. Limits and colimits | 12 | Universal constructions over whole diagrams |
| 12. Free monoids | 13 | Lists as the free monoid; `foldMap` |
| 13. Representable functors | 14 | Containers that are secretly functions |
| 14. The Yoneda lemma | 15-16 | Polymorphic functions are determined by one value |
| 15. Adjunctions | 18 | Optimal approximate inverses |
| 16. Monads | 20-22 | Sequencing effects lawfully |

### Notation

| Symbol | Meaning |
|---|---|
| $\mathcal C$, $\mathcal D$ | categories |
| $a, b, c$ | objects (for us, usually types) |
| $f : a \to b$ | an arrow (morphism) from $a$ to $b$ |
| $\mathcal C(a,b)$ | the hom-set: all arrows from $a$ to $b$ in $\mathcal C$ |
| $g\circ f$ | "$g$ after $f$"; Haskell `g . f` |
| $$\mathrm{id}_a$$ | identity arrow on $a$; Haskell `id` |
| $F\,a$ | a functor $F$ applied to object $a$ |
| $\alpha : F \Rightarrow G$ | a natural transformation |

## 1. Composition Is the Essence

### 1.1 Starting from Ordinary Functions

Suppose we have two functions:

```haskell
length :: String -> Int
isEven :: Int -> Bool
```

The output type of `length` is the input type of `isEven`, so we can feed one into the other:

```haskell
hasEvenLength :: String -> Bool
hasEvenLength = isEven . length
-- hasEvenLength "ab"  == True
-- hasEvenLength "abc" == False
```

The dot is just function composition, defined as

```haskell
(.) :: (b -> c) -> (a -> b) -> (a -> c)
(g . f) x = g (f x)
```

Notice the order: `g . f` means "first `f`, then `g`". Mathematicians write $g\circ f$ and read it "$g$ after $f$". If you prefer left-to-right pipelines, Haskell's `Data.Function.(&)` and F#'s `|>` exist; the mathematics is the same.

The same idea in other languages:

```python
def compose(g, f):
    return lambda x: g(f(x))

has_even_length = compose(lambda n: n % 2 == 0, len)
```

```cpp
template <class G, class F>
auto compose(G g, F f) {
    return [=](auto x) { return g(f(x)); };
}
```

There is also a function that does nothing:

```haskell
id :: a -> a
id x = x
```

`id` looks useless, but it plays the role that $0$ plays for addition or $1$ for multiplication: it is the neutral element of composition.

### 1.2 The Two Laws

Function composition satisfies two laws, both of which you can check by expanding the definitions.

**Associativity.** For $f : a\to b$, $g : b\to c$, $h : c\to d$:

```haskell
h . (g . f) == (h . g) . f
```

Proof by applying both sides to an arbitrary `x`:

```text
(h . (g . f)) x = h ((g . f) x) = h (g (f x))
((h . g) . f) x = (h . g) (f x) = h (g (f x))
```

**Identity.** For any $f : a \to b$:

```haskell
id . f == f
f . id == f
```

Associativity is why we can write long pipelines `h . g . f` without parentheses. Identity is why an adapter that "does nothing" can be inserted or removed safely. These are exactly the laws that make refactoring possible: you can regroup a pipeline, extract a sub-pipeline into a named helper, or inline it again, and the meaning does not change.

{% include figure.html image="/assets/img/posts/category-theory/composition-law-map.svg" alt="Category diagram showing objects, arrows, identity, and associative composition." caption="Category theory starts with one engineering demand: arrows should compose lawfully, with identity doing nothing." %}

### 1.3 The Definition of a Category

Now we forget that the arrows are functions and keep only the structure.

> **Definition (category).** A category $\mathcal C$ consists of
>
> 1. a collection of **objects**;
> 2. for every pair of objects $a, b$, a collection of **arrows** (morphisms) $\mathcal C(a,b)$;
> 3. a **composition** operation: for $f\in\mathcal C(a,b)$ and $g\in\mathcal C(b,c)$, an arrow $g\circ f\in\mathcal C(a,c)$;
> 4. for every object $a$, an **identity** arrow $$\mathrm{id}_a \in \mathcal C(a,a)$$;
>
> such that composition is associative, $h\circ(g\circ f) = (h\circ g)\circ f$, and identities are neutral, $$\mathrm{id}_b\circ f = f = f\circ \mathrm{id}_a$$.

Three things are worth noticing.

1. **Objects are atoms.** The definition never looks inside an object. We cannot ask "what elements does $a$ contain?" Everything we learn about an object, we learn from the arrows going in and out of it. This is the single most important shift in perspective, and it is the reason category theory feels like interface design: you characterize a thing by how it can be used, not by how it is built.
2. **Not every pair of arrows composes.** $g\circ f$ only makes sense when the target of $f$ is the source of $g$. This is type checking.
3. **Arrows need not be functions.** In some categories an arrow is a proof, a path, an inequality, or a matrix. The laws are all that matter.

### 1.4 Why Programmers Should Care

Programming is the activity of decomposing a problem into smaller problems and composing the solutions. The decomposition only pays off if the composition is predictable. Category theory studies exactly the structures where composition is predictable, and it gives us vocabulary for recognizing them when they appear in disguise: in parsers, in database queries, in effectful code, in UI pipelines, in probability.

A useful slogan from the book: **we want chunks whose surface area grows more slowly than their volume.** The "surface" of a chunk is what you need to know to compose it (its type and laws); the "volume" is its implementation. Category theory is the art of describing things by their surface.

### Exercises

1. Implement `id` and composition in your favourite language. Write a test showing `compose(id, f)` and `f` agree on many inputs.
2. Is the World Wide Web a category if objects are pages and arrows are links? (Hint: what is the composite of two links? What if arrows are *paths* of links?)
3. Is a social network with "is a friend of" as arrows a category?

### What to Remember

- A category = objects + arrows + associative composition + identities.
- Objects are opaque; all information lives in the arrows.
- The laws are the point: they make composition predictable and refactoring safe.

## 2. Types and Functions

### 2.1 Types as Sets

To get a first concrete category, we interpret types as sets of values: `Bool` is the two-element set $\lbrace \mathrm{True}, \mathrm{False}\rbrace$, `Int` is a (large) finite set of machine integers, `Integer` is infinite, and `String` is the set of all finite character sequences. A function `f :: a -> b` is then a mathematical function from set $a$ to set $b$.

This gives the category **Set**: objects are sets, arrows are total functions, composition is function composition, identities are identity functions.

**Caveat: Hask is not quite Set.** A Haskell function might not terminate. Haskell models this by adding a special value "bottom" ($\bot$) to every type, so `f :: Bool -> Bool` could also return $\bot$. Bottom, together with `seq`, breaks a few laws in edge cases. The usual attitude, which I follow, is to reason in the idealized category of sets and total functions and treat bottom as a known approximation. Milewski does the same.

### 2.2 Pure Functions

A function in the mathematical sense always returns the same output for the same input and has no side effects. One practical test: **a pure function can be memoized** (replaced by a lookup table) without changing program behaviour. Haskell enforces purity by default; in C++ or Python it is a discipline.

Why purity matters here: if a "function" reads a global variable or prints to the console, then `g . f` is no longer determined by `g` and `f` alone. The composite also depends on the hidden state of the world, and the laws of section 1 fail. Section 4 shows how to bring effects back *without* giving up the laws.

### 2.3 The Smallest Types

Three tiny types turn out to be surprisingly important.

**`Void`: the empty type.** It has no values. There is exactly one function from `Void` to any type:

```haskell
absurd :: Void -> a
```

You can never call it, because you can never produce a `Void` argument. Logically, `absurd` says "from falsehood, anything follows".

**`()`: the unit type.** It has exactly one value, also written `()`. There is exactly one function from any type to `()`:

```haskell
unit :: a -> ()
unit _ = ()
```

Functions *from* `()` are more interesting. A function `() -> Int` must pick a single integer, so functions `() -> a` correspond one-to-one with values of type `a`:

```haskell
fortyTwo :: () -> Int
fortyTwo () = 42
```

This is how category theory talks about "elements" without looking inside objects: an element of $a$ is an arrow $1 \to a$ from the one-element set.

**`Bool`: two values.** Functions out of `Bool` are pairs of values (one per case); functions into `Bool` are predicates.

### 2.4 Counting Functions

How many functions are there from `Bool` to `Bool`? Each of the two inputs can map to either of two outputs, so $2^2 = 4$:

```haskell
f1 x = x          -- id
f2 x = not x      -- not
f3 _ = True       -- const True
f4 _ = False      -- const False
```

In general, between finite sets with $\lvert a\rvert$ and $\lvert b\rvert$ elements there are $\lvert b\rvert^{\lvert a\rvert}$ functions. Keep this formula in mind; in section 9 it reappears as the reason function types are called *exponentials*.

### What to Remember

- Set (or idealized Haskell, "Hask") is the running example: types are objects, pure total functions are arrows.
- `Void` has one function out to everything; `()` has one function in from everything.
- Arrows from `()` are elements. Category theory recovers "elements" through arrows.
- Purity is what makes composition depend only on the parts.

## 3. Categories Great and Small

Before going further with types, it helps to see how many familiar structures are categories. This prevents us from thinking "category = types and functions".

### 3.1 Free Categories from Graphs

Take any directed graph. Make the nodes objects and the edges arrows. This is not yet a category: we need identities and composites. So add an identity loop at every node, and for every path $e_1, e_2, \ldots, e_k$ add an arrow representing the whole path. Composition is path concatenation, which is associative; the identity is the empty path.

This is the **free category** generated by the graph. "Free" means we added only what the laws demand and imposed no extra equations. We will meet freeness again with monoids (section 12) and adjunctions (section 15).

### 3.2 Orders

A **preorder** is a relation $\le$ that is reflexive ($a\le a$) and transitive ($a\le b$ and $b\le c$ imply $a\le c$). It is a category:

- objects are elements;
- there is one arrow $a\to b$ exactly when $a\le b$, and no arrow otherwise;
- composition is transitivity, identity is reflexivity.

In such a category every hom-set has at most one element, so all diagrams commute automatically. A category of this kind is called *thin*. A **partial order** additionally satisfies antisymmetry ($a\le b$ and $b\le a$ imply $a=b$); a **total order** additionally compares every pair.

A concrete example that we will reuse: positive integers ordered by divisibility, with an arrow $a\to b$ when $a$ divides $b$.

### 3.3 Monoids as One-Object Categories

A **monoid** is a set $M$ with an associative binary operation and a neutral element. Examples:

| Set | Operation | Neutral element |
|---|---|---|
| integers | addition | 0 |
| integers | multiplication | 1 |
| strings | concatenation `++` | `""` |
| booleans | `&&` | `True` |
| functions $a\to a$ | composition | `id` |

In Haskell:

```haskell
class Semigroup m => Monoid m where
  mempty :: m

-- with (<>) :: m -> m -> m from Semigroup, satisfying
--   (x <> y) <> z == x <> (y <> z)
--   mempty <> x == x == x <> mempty

instance Semigroup [a] where (<>) = (++)
instance Monoid    [a] where mempty = []
```

Now the categorical view. Take a category with **one object** $\star$. Its arrows are all in $\mathcal C(\star,\star)$, so any two arrows compose. Composition is associative and has an identity. That is exactly a monoid: the elements are the arrows, the operation is composition, the neutral element is $$\mathrm{id}_\star$$.

To make it concrete, take the monoid of strings. For each string `s`, define the function "append `s`":

```haskell
appendS :: String -> (String -> String)
appendS s = (s ++)

-- appendS "ab" . appendS "cd"  ==  appendS ("ab" ++ "cd")
-- appendS ""                    ==  id
```

So each element becomes an arrow, composition of arrows corresponds to the monoid operation, and the neutral element becomes the identity. A monoid *is* a category with one object. This observation becomes the punchline of the whole book: a monad is a monoid, just in a fancier category.

### Exercises

1. In the divisibility order, what is the arrow from 2 to 6? From 6 to 2?
2. Show that `Bool` with `||` and `False` is a monoid. What about `Bool` with exclusive-or?
3. Draw the free category generated by a graph with one node and one edge. What familiar monoid is it? (Answer: natural numbers with addition: an arrow is "go around the loop $n$ times".)

### What to Remember

- Graphs generate free categories (paths); orders are thin categories; monoids are one-object categories.
- "Free" means: add exactly what the laws require, nothing more.
- Monoid = one-object category. Hold on to this; it explains monads later.

## 4. Kleisli Categories: Composing Effects

### 4.1 The Problem: Logging

Suppose we want functions that also produce a log. The imperative solution uses a global variable:

```cpp
std::string logger;

bool negate(bool b) {
    logger += "Not so! ";
    return !b;
}
```

This is not a pure function: the same call has different effects depending on when it happens, and composing two such functions also composes hidden writes to `logger`. Testing and reasoning become hard.

The pure solution is to **return the log** instead of writing it:

```haskell
type Writer a = (a, String)

negate' :: Bool -> Writer Bool
negate' b = (not b, "Not so! ")

isEven :: Int -> Writer Bool
isEven n = (n `mod` 2 == 0, "isEven ")
```

But now we cannot compose with `.`: `negate' . isEven` does not type-check, because `isEven` returns a pair and `negate'` wants a `Bool`.

### 4.2 Composition for Embellished Functions

We call `a -> Writer b` an **embellished function**. Let us write the composition we want by hand: run the first function, run the second on its result, and concatenate the logs.

```haskell
(>=>) :: (a -> Writer b) -> (b -> Writer c) -> (a -> Writer c)
m1 >=> m2 = \x ->
  let (y, s1) = m1 x
      (z, s2) = m2 y
  in  (z, s1 ++ s2)

isOdd :: Int -> Writer Bool
isOdd = isEven >=> negate'
-- isOdd 3 == (True, "isEven Not so! ")
```

The operator `>=>` is nicknamed the **fish**. Its arguments are written in pipeline order (first `m1`, then `m2`).

We also need an identity: an embellished function `a -> Writer a` that does nothing. "Nothing" for a log means the empty string:

```haskell
retW :: a -> Writer a
retW x = (x, "")
```

### 4.3 Checking the Laws

Is this really a category? Objects: Haskell types. Arrows from `a` to `b`: functions `a -> Writer b`. We must check the laws.

**Left identity.** `retW >=> f` runs `retW x = (x, "")`, then `f x = (z, s)`, giving `(z, "" ++ s) = (z, s) = f x`. So `retW >=> f == f`, because `""` is a left unit for `++`. The right identity law uses `s ++ "" == s`.

**Associativity.** In `(f >=> g) >=> h` versus `f >=> (g >=> h)`, the value flows through `f`, `g`, `h` in the same order either way, and the logs are combined as `(s1 ++ s2) ++ s3` versus `s1 ++ (s2 ++ s3)`. These are equal because `++` is associative.

The laws hold **because strings form a monoid**. Nothing about strings was used except `++` and `""`. So the construction works for any monoid `w`:

```haskell
newtype Writer w a = Writer (a, w)

(>=>) :: Monoid w => (a -> Writer w b) -> (b -> Writer w c) -> (a -> Writer w c)
f >=> g = \x ->
  let Writer (y, w1) = f x
      Writer (z, w2) = g y
  in  Writer (z, w1 <> w2)
```

With `w = Sum Int` the "log" counts operations; with `w = [String]` it collects messages; with `w = Max Int` it tracks a peak value.

### 4.4 A Second Example: Partial Functions

Functions like square root or reciprocal are not defined everywhere. Embellish the result with `Maybe`:

```haskell
safeRoot :: Double -> Maybe Double
safeRoot x
  | x >= 0    = Just (sqrt x)
  | otherwise = Nothing

safeReciprocal :: Double -> Maybe Double
safeReciprocal 0 = Nothing
safeReciprocal x = Just (1 / x)

(>=>) :: (a -> Maybe b) -> (b -> Maybe c) -> (a -> Maybe c)
f >=> g = \x -> case f x of
  Nothing -> Nothing
  Just y  -> g y

safeRootReciprocal :: Double -> Maybe Double
safeRootReciprocal = safeReciprocal >=> safeRoot
-- safeRootReciprocal 4    == Just 0.5
-- safeRootReciprocal 0    == Nothing
-- safeRootReciprocal (-4) == Nothing
```

The identity is `Just :: a -> Maybe a`. Checking the laws is a short case analysis, left as an exercise.

### 4.5 The General Pattern

In both examples:

- we have a type constructor `m` (`Writer w` or `Maybe`) that "embellishes" results;
- arrows from `a` to `b` are functions `a -> m b`;
- there is a composition `>=>` and an identity `a -> m a`;
- the laws hold.

This is a **Kleisli category**. The type constructor `m` is a **monad** precisely when such a composition and identity exist and satisfy the laws. We will define monads properly in section 16. The lesson for now: **effectful code is not broken pure code; it is code that lives in a different category, with a different composition.**

### Exercises

1. Check the identity and associativity laws for the `Maybe` fish by case analysis.
2. Write a Kleisli composition for `a -> [b]` (a function returning several possible answers). What is the identity? (Hint: the identity returns a singleton list; composition uses `concatMap`.)
3. Why does the logging example break if we replace the log with a type that has an associative operation but no neutral element?

### What to Remember

- An embellished function is `a -> m b`.
- If embellished functions compose associatively with an identity, they form a Kleisli category.
- For `Writer`, the laws come from the monoid laws of the log.

## 5. Universal Constructions: Initial, Terminal, Product, Coproduct

### 5.1 The Method

Because we cannot look inside objects, how do we define "the pair type" or "the empty type"? The answer is the **universal construction**, a recipe in two steps:

1. **Pattern.** Describe a shape made of an object and some arrows. Many objects will fit the pattern.
2. **Ranking.** Among all candidates, pick the "best" one: the one through which every other candidate factors uniquely.

The best candidate is unique up to a unique isomorphism, so this defines an object purely in terms of its relationships. This is how category theory replaces implementation details with interface specifications.

### 5.2 Initial and Terminal Objects

**Initial object.** An object $0$ with exactly one arrow $0\to a$ to every object $a$.

- In Set: the empty set (the empty function is the unique map).
- In Hask: `Void`, with `absurd`.
- In a partial order: the least element, if one exists.

**Terminal object.** An object $1$ with exactly one arrow $a\to 1$ from every object $a$.

- In Set: any singleton set.
- In Hask: `()`, with `unit`.
- In a partial order: the greatest element.

**Uniqueness up to unique isomorphism.** An *isomorphism* is an arrow $f : a\to b$ with an inverse $g : b\to a$, meaning $$g\circ f = \mathrm{id}_a$$ and $$f\circ g=\mathrm{id}_b$$. Suppose $i_1$ and $i_2$ are both initial. Then there are unique arrows $f : i_1\to i_2$ and $g : i_2\to i_1$. The composite $g\circ f$ is an arrow $i_1\to i_1$; but $$\mathrm{id}_{i_1}$$ is also such an arrow and, since $i_1$ is initial, there is only one. So $$g\circ f = \mathrm{id}_{i_1}$$. Symmetrically $$f\circ g = \mathrm{id}_{i_2}$$. Every universal construction comes with this argument.

### 5.3 Duality

For any category $\mathcal C$, the **opposite category** $\mathcal C^{op}$ has the same objects and every arrow reversed. A terminal object in $\mathcal C$ is an initial object in $\mathcal C^{op}$. So each definition comes with a free dual definition, usually named with the prefix "co". This halves the work: once we understand products, we get coproducts for free.

### 5.4 Products

**Pattern.** A candidate product of $a$ and $b$ is an object $c$ with two arrows

$$
p : c \to a,\qquad q : c \to b.
$$

Many types fit. For `a = Int` and `b = Bool`:

- `c = Int` with `p = id` and `q = const True`. This candidate is too small: it cannot represent the pair `(3, False)`.
- `c = (Int, Int, Bool)` with `p (x, _, _) = x` and `q (_, _, b) = b`. This candidate is too big: it carries a useless extra `Int`.
- `c = (Int, Bool)` with `p = fst` and `q = snd`. This looks just right.

**Ranking.** Candidate $(c, p, q)$ is *better* than $$(c', p', q')$$ if there is a unique arrow $$m : c'\to c$$ such that

$$
p' = p\circ m,\qquad q' = q\circ m.
$$

That is, the other candidate's projections can be recovered by first mapping into $c$.

**Definition.** The **product** $a\times b$ is the best candidate: for every candidate $$(c', p', q')$$ there is exactly one $m$ making the two triangles commute.

In Haskell, the unique $m$ is the function that builds a pair from the two projections:

```haskell
factorizer :: (c -> a) -> (c -> b) -> (c -> (a, b))
factorizer p q = \x -> (p x, q x)
```

Test it against the bad candidates:

- For the "too small" `Int`, $m$ = `\x -> (x, True)`. It exists and is unique, so `Int` is worse than the pair, as expected.
- For the "too big" triple, `m (x, _, b) = (x, b)` works. In the other direction, any map from pairs to triples must invent the middle `Int`, and there are many choices (`(x, b) -> (x, 0, b)`, `(x, b) -> (x, 7, b)`, ...). Since such an $m$ is not unique, the triple is not better than the pair.

**The divisibility order.** Here an arrow $c\to a$ means "$c$ divides $a$". A candidate product of $a$ and $b$ is a common divisor $c$. The ranking says the best common divisor is one that every other common divisor divides: the **greatest common divisor**. So in this category, $a\times b = \gcd(a,b)$. The same universal definition gives tuples in Hask and gcd in arithmetic.

### 5.5 Coproducts

Reverse all the arrows. A candidate coproduct of $a$ and $b$ is an object $c$ with **injections**

$$
i : a\to c,\qquad j : b\to c,
$$

and the best one admits a unique $$m : c\to c'$$ to any other candidate with $$i' = m\circ i$$, $$j' = m\circ j$$.

In Hask, the coproduct is the tagged union:

```haskell
data Either a b = Left a | Right b

factorizer :: (a -> c) -> (b -> c) -> (Either a b -> c)
factorizer i j (Left  x) = i x
factorizer i j (Right y) = j y
```

This is `either` from the Prelude. Writing a function out of a sum type by pattern matching *is* using the universal property of the coproduct.

In the divisibility order, the coproduct is the **least common multiple**.

{% include figure.html image="/assets/img/posts/category-theory/products-coproducts-adt.svg" alt="Diagram mapping products to records and coproducts to tagged alternatives in algebraic data types." caption="ADTs are built from product-like fields and coproduct-like alternatives; universal properties explain why these encodings are canonical." %}

### 5.6 An Asymmetry Worth Noticing

In Set, products and coproducts behave differently even though they are dual. A function *into* a product is the same as a pair of functions (that is the factorizer). A function *out of* a product is not generally a pair of functions. Dually, a function *out of* a coproduct is a pair of functions, while a function *into* a coproduct must commit to one side for each input. Duality relates $\mathcal C$ to $\mathcal C^{op}$, but Set is not equivalent to its own opposite, so the two constructions feel different in practice.

### Exercises

1. Show that the terminal object is the product of zero objects, and the initial object is the coproduct of zero objects.
2. In the divisibility order, what are the initial and terminal objects? (Initial: 1, since 1 divides everything. Terminal: none among positive integers, unless you add 0, which every number divides.)
3. Implement `factorizer` for a candidate coproduct `c = Int` of `a = Int` and `b = Bool`, with `i = id` and `j b = if b then 1 else 0`. Why is `Int` worse than `Either Int Bool`?

### What to Remember

- Universal construction = pattern + "best candidate", where best means "every other candidate factors through it uniquely".
- Initial and terminal objects; products (tuples) and coproducts (tagged unions).
- The factorizer is the universal property expressed as a function.
- Universal objects are unique up to unique isomorphism.

## 6. Algebraic Data Types: Types Form a Semiring

### 6.1 Products of Types

Haskell gives us tuples and records:

```haskell
data Point = Point Double Double
data Person = Person { name :: String, age :: Int }
```

Both are products. Up to isomorphism, the product type behaves like multiplication:

```haskell
swap :: (a, b) -> (b, a)
swap (x, y) = (y, x)

assoc :: ((a, b), c) -> (a, (b, c))
assoc ((x, y), z) = (x, (y, z))

rUnit :: (a, ()) -> a
rUnit (x, ()) = x
```

Each has an obvious inverse. So with `(,)` as multiplication and `()` as 1, types form a commutative monoid *up to isomorphism*: $a\times b\cong b\times a$, $(a\times b)\times c\cong a\times(b\times c)$, $a\times 1\cong a$.

### 6.2 Sums of Types

```haskell
data Bool  = False | True       -- 1 + 1 = 2
data Maybe a = Nothing | Just a  -- 1 + a
```

`Either` is addition with `Void` as zero: `Either a Void` is isomorphic to `a`, because the `Right` case can never occur.

### 6.3 The Semiring

Combining both, we get a semiring of types, with multiplication distributing over addition:

$$
a\times(b + c)\cong a\times b + a\times c.
$$

The isomorphism is easy to write, and writing it is the proof:

```haskell
prodToSum :: (a, Either b c) -> Either (a, b) (a, c)
prodToSum (x, Left y)  = Left  (x, y)
prodToSum (x, Right z) = Right (x, z)

sumToProd :: Either (a, b) (a, c) -> (a, Either b c)
sumToProd (Left  (x, y)) = (x, Left y)
sumToProd (Right (x, z)) = (x, Right z)
```

The dictionary:

| Algebra | Types |
|---|---|
| $0$ | `Void` |
| $1$ | `()` |
| $a + b$ | `Either a b` |
| $a \times b$ | `(a, b)` |
| $2 = 1 + 1$ | `Bool` |
| $1 + a$ | `Maybe a` |

**Counting check.** For finite types, the number of values follows the algebra. `Either Bool Bool` has $2+2=4$ values; `(Bool, Maybe Bool)` has $2\times 3 = 6$ values. This is a quick sanity check on any data model: if your type has more values than the states you want to represent, it admits illegal states.

### 6.4 Recursive Types and a Surprising Calculation

A list is either empty or an element followed by a list:

```haskell
data List a = Nil | Cons a (List a)
```

Translate to algebra: $L = 1 + a\times L$. Now manipulate it formally, as if it were a number:

$$
L = 1 + aL \;\Rightarrow\; L(1-a) = 1 \;\Rightarrow\; L = \frac{1}{1-a} = 1 + a + a^2 + a^3 + \cdots
$$

Subtraction and division do not exist for types, but the final answer reads perfectly: a list is either empty ($1$), or one element ($a$), or two elements ($a^2$), and so on. You can reach the same result legitimately by substituting the equation into itself repeatedly.

### 6.5 Sum-of-Products Modelling

Most real data types are sums of products:

```haskell
data Shape
  = Circle Double              -- radius
  | Rect   Double Double       -- width, height

area :: Shape -> Double
area (Circle r) = pi * r * r
area (Rect w h) = w * h
```

`area` is defined by giving one function per alternative: the coproduct factorizer again.

### 6.6 Curry-Howard Preview

Read types as propositions and values as proofs:

| Logic | Types |
|---|---|
| false | `Void` |
| true | `()` |
| $A \lor B$ | `Either a b` |
| $A \land B$ | `(a, b)` |
| $A \Rightarrow B$ | `a -> b` |

To prove "$A\land B$ implies $B\land A$", write a total function `(a, b) -> (b, a)`: that is `swap`. A proposition is true when its type is inhabited by a total, terminating function.

### Exercises

1. Show `Maybe a` is isomorphic to `Either () a` by writing both directions.
2. A binary tree is `data Tree a = Leaf | Node (Tree a) a (Tree a)`. Write its algebraic equation $T = 1 + aT^2$.
3. How many values does `(Bool, Either () Bool)` have? Check by enumeration.

### What to Remember

- Product types multiply, sum types add, `Void` is 0, `()` is 1.
- Isomorphisms between types are proofs of algebraic identities.
- Counting values is a quick check for illegal states in a data model.

## 7. Functors

### 7.1 Mapping Between Categories

A functor is a map between categories that preserves structure. It maps objects to objects and arrows to arrows, and it must not break composition.

> **Definition (functor).** A functor $F:\mathcal C\to\mathcal D$ assigns
>
> - to each object $a$ of $\mathcal C$ an object $F\,a$ of $\mathcal D$;
> - to each arrow $f : a\to b$ an arrow $F\,f : F\,a\to F\,b$;
>
> such that $$F(\mathrm{id}_a)=\mathrm{id}_{F\,a}$$ and $F(g\circ f) = F\,g\circ F\,f$.

The second condition is important: if $h = g\circ f$ in $\mathcal C$, then $F\,h = F\,g\circ F\,f$ in $\mathcal D$. A functor can collapse objects or arrows together, but it cannot tear a composite apart.

In programming we mostly meet **endofunctors** on Hask: a type constructor `f` maps a type `a` to a type `f a`, and a function `fmap` lifts arrows:

```haskell
class Functor f where
  fmap :: (a -> b) -> (f a -> f b)

-- Laws:
--   fmap id      == id
--   fmap (g . f) == fmap g . fmap f
```

### 7.2 Deriving the Maybe Functor

`Maybe` is a type constructor: `Maybe Int`, `Maybe String`, and so on. To make it a functor we need `fmap :: (a -> b) -> Maybe a -> Maybe b`. There are two cases, and the types force the answer:

```haskell
instance Functor Maybe where
  fmap _ Nothing  = Nothing
  fmap f (Just x) = Just (f x)
```

Let us verify the laws by **equational reasoning**, the technique of substituting definitions step by step.

*Identity law.*

```text
fmap id Nothing  = Nothing          -- definition
                 = id Nothing       -- definition of id
fmap id (Just x) = Just (id x)      -- definition
                 = Just x
                 = id (Just x)
```

*Composition law.*

```text
fmap (g . f) Nothing  = Nothing
                      = fmap g Nothing
                      = fmap g (fmap f Nothing)

fmap (g . f) (Just x) = Just ((g . f) x)
                      = Just (g (f x))
                      = fmap g (Just (f x))
                      = fmap g (fmap f (Just x))
```

Both laws hold. Equational reasoning works only because the functions are pure: we can replace equals by equals anywhere.

### 7.3 A Lawless "Functor"

The laws are not decorative. Consider

```haskell
badFmap :: (a -> b) -> [a] -> [b]
badFmap f xs = reverse (map f xs)
```

The types are right, but `badFmap id [1,2,3] = [3,2,1]`, which is not `id [1,2,3]`. Code written against the `Functor` interface assumes that `fmap id` changes nothing; this instance would silently corrupt every such program. The type checker cannot see laws, so the programmer must.

### 7.4 More Functors

**Lists.**

```haskell
instance Functor [] where
  fmap _ []       = []
  fmap f (x : xs) = f x : fmap f xs
```

**Reader** (functions out of a fixed type `r`). The type constructor is `(->) r`, so `f a` means `r -> a`. We need `fmap :: (a -> b) -> (r -> a) -> (r -> b)`. Only one thing type-checks: composition.

```haskell
instance Functor ((->) r) where
  fmap f g = f . g
```

**Const** (ignores its argument).

```haskell
newtype Const c a = Const c

instance Functor (Const c) where
  fmap _ (Const v) = Const v
```

`Const` looks silly but is used heavily in lens libraries to "read" a value while pretending to map over a structure.

### 7.5 Containers or Computations?

It is tempting to say "a functor is a container". Lists and `Maybe` fit that picture. Reader does not obviously fit: a function `r -> a` does not store any `a`. But if `r` is finite, a function is the same as a lookup table, which *is* a container indexed by `r`. And conversely, a list can be lazily infinite and computed on demand, like a function. The categorical view dissolves the distinction: a functor is any construction that lets us map arrows lawfully. Section 13 makes this precise with representable functors.

### 7.6 Composing Functors

Functors compose. If `f` and `g` are functors, so is `f . g` on types, with `fmap = fmap . fmap`:

```haskell
maybeTail :: [a] -> Maybe [a]
maybeTail []       = Nothing
maybeTail (_ : xs) = Just xs

square :: Int -> Int
square x = x * x

-- fmap (fmap square) (maybeTail [1, 2, 3]) == Just [4, 9]
```

So categories and functors themselves form a category, **Cat**, with functor composition and identity functors. (Size issues aside: Cat contains small categories, not itself.)

### Exercises

1. Prove the functor laws for the list instance by induction on the list.
2. Can `fmap _ _ = Nothing` be a lawful `fmap` for `Maybe`? Which law fails?
3. Prove the functor laws for Reader. (Hint: they are the associativity and identity laws of composition.)

### What to Remember

- A functor maps objects and arrows, preserving identities and composition.
- In Haskell: a type constructor plus a lawful `fmap`.
- The type often forces the implementation; the laws rule out "clever" wrong ones.
- Containers and functions are two views of the same idea.

## 8. Functoriality: Bifunctors, Contravariance, Profunctors

### 8.1 Bifunctors

A type constructor with two arguments, like `(,)` or `Either`, is functorial in both:

```haskell
class Bifunctor f where
  bimap :: (a -> c) -> (b -> d) -> f a b -> f c d

instance Bifunctor (,) where
  bimap f g (x, y) = (f x, g y)

instance Bifunctor Either where
  bimap f _ (Left x)  = Left (f x)
  bimap _ g (Right y) = Right (g y)
```

Formally, a bifunctor is a functor from the **product category** $\mathcal C\times\mathcal D$, whose objects are pairs $(a, b)$ and whose arrows are pairs of arrows.

Algebraic data types built from sums, products, constants, and other functors are automatically functors. This is why GHC can derive `Functor` instances: `deriving Functor` is mechanically following the structure of the type.

### 8.2 Writer Is a Functor

We built the Writer Kleisli category in section 4. It also gives a functor, and we get `fmap` from the fish:

```haskell
fmap :: (a -> b) -> Writer w a -> Writer w b
fmap f = id >=> (\x -> retW (f x))
```

Here `id :: Writer w a -> Writer w a` is used as a Kleisli arrow from `Writer w a` to `a`. The general lesson: **every Kleisli category gives a functor for free.** That is why every monad is a functor.

### 8.3 Contravariant Functors

Reader is functorial in its *result* type. What about its *argument* type? Define

```haskell
newtype Op r a = Op (a -> r)
```

Given `f :: b -> a`, we can turn `Op r a` into `Op r b` by precomposition:

```haskell
contramap :: (b -> a) -> Op r a -> Op r b
contramap f (Op g) = Op (g . f)
```

The arrow direction flipped: from `b -> a` we got `Op r a -> Op r b`. This is a **contravariant functor**, which is a functor from $\mathcal C^{op}$.

A practical example: predicates.

```haskell
newtype Predicate a = Predicate { runPredicate :: a -> Bool }

isLong :: Predicate Int
isLong = Predicate (> 10)

isLongString :: Predicate String
isLongString = Predicate (runPredicate isLong . length)  -- this is contramap length isLong
```

Comparators, serializers, event handlers, and validators are all contravariant: they *consume* values, so to adapt them to a new type you pre-process the input.

### 8.4 Profunctors

The function type `a -> b` is contravariant in `a` and covariant in `b`:

```haskell
class Profunctor p where
  dimap :: (a' -> a) -> (b -> b') -> p a b -> p a' b'

instance Profunctor (->) where
  dimap f g h = g . h . f
```

`dimap` says: to adapt a function, pre-process its input and post-process its output. Profunctors are the foundation of modern optics libraries.

### What to Remember

- Bifunctors map in two arguments; products and sums are bifunctors.
- Producers of `a` are covariant; consumers of `a` are contravariant.
- Functions are profunctors: contravariant in the input, covariant in the output.

## 9. Function Types: Exponentials and Currying

### 9.1 Functions as Objects

So far, `a -> b` has been a hom-set $\mathcal C(a,b)$, a set of arrows *outside* the category. But in Haskell, `a -> b` is also a type, an object *inside* Hask. How do we describe such an object by a universal construction?

**Pattern.** A candidate function object from $a$ to $b$ is an object $z$ with an arrow

$$
g : z\times a\to b.
$$

Think of $z$ as "something that can be applied to an $a$ to get a $b$".

**Ranking.** The best candidate, written $b^a$ or $a\Rightarrow b$, comes with an evaluation arrow $\mathrm{eval} : b^a\times a\to b$, and for every candidate $(z, g)$ there is a unique $h : z\to b^a$ such that

$$
g = \mathrm{eval}\circ(h\times\mathrm{id}_a).
$$

In Haskell, `eval (f, x) = f x`, and the unique $h$ is the curried form of $g$:

```haskell
curry :: ((z, a) -> b) -> (z -> (a -> b))
curry g = \z -> \x -> g (z, x)

uncurry :: (z -> (a -> b)) -> ((z, a) -> b)
uncurry h = \(z, x) -> h z x
```

`curry` and `uncurry` are inverse, which says

$$
\mathcal C(z\times a, b)\;\cong\;\mathcal C(z, b^a).
$$

This is not syntax sugar. It is a structural statement: maps out of a product are the same as maps into a function space. Section 15 identifies it as the most important example of an adjunction.

### 9.2 Why "Exponential"

For finite sets there are $\lvert b\rvert^{\lvert a\rvert}$ functions from $a$ to $b$. More strikingly, the algebraic laws of exponents hold as isomorphisms of types:

| Algebra | Types | Meaning |
|---|---|---|
| $a^0 = 1$ | `Void -> a` has one value | only `absurd` |
| $1^a = 1$ | `a -> ()` has one value | only `unit` |
| $a^1 = a$ | `() -> a` is `a` | elements are maps from unit |
| $a^{b+c} = a^b\times a^c$ | `Either b c -> a` is `(b -> a, c -> a)` | coproduct factorizer |
| $(a^b)^c = a^{b\times c}$ | `c -> (b -> a)` is `(c, b) -> a` | currying |
| $(a\times b)^c = a^c\times b^c$ | `c -> (a, b)` is `(c -> a, c -> b)` | product factorizer |

Every row is a theorem from earlier sections, now written as high-school algebra.

### 9.3 Cartesian Closed Categories

A category with a terminal object, all binary products, and all exponentials is **cartesian closed** (a CCC). Set and (idealized) Hask are CCCs. CCCs are exactly the models of the simply typed lambda calculus: lambda abstraction is currying, application is `eval`. This is why category theory is the natural semantics for functional languages.

### 9.4 Curry-Howard, Completed

With exponentials, the logic dictionary gains implication: $a\to b$ is "$A$ implies $B$", and `eval :: (a -> b, a) -> b` is modus ponens.

To prove a proposition, implement it totally:

```haskell
-- (A ∧ (A ⇒ B)) ⇒ B
modusPonens :: (a, a -> b) -> b
modusPonens (x, f) = f x

-- ((A ∨ B) ⇒ C) ⇒ (A ⇒ C)
weaken :: (Either a b -> c) -> (a -> c)
weaken f = f . Left
```

Try implementing `Either a b -> a`. You cannot (the `Right` case has no `a`), which reflects that "$A\lor B$ implies $A$" is not a theorem.

### Exercises

1. Write the isomorphism between `Either b c -> a` and `(b -> a, c -> a)` in both directions.
2. Prove $a^{b\times c}\cong (a^b)^c$ by counting for `a = Bool`, `b = Bool`, `c = ()`.
3. Is `(a -> b) -> (b -> a)` inhabited for all `a`, `b`? What does that mean logically?

### What to Remember

- The function type is the exponential $b^a$, defined by a universal property with `eval`.
- Currying is the isomorphism $\mathcal C(z\times a, b)\cong \mathcal C(z, b^a)$.
- CCCs model typed lambda calculus; Curry-Howard reads types as propositions.

## 10. Natural Transformations

### 10.1 Polymorphic Functions Between Functors

Consider

```haskell
safeHead :: [a] -> Maybe a
safeHead []      = Nothing
safeHead (x : _) = Just x
```

It works for *every* `a`, and it does not look at the elements; it only rearranges structure. Category theory calls such a family of functions, one for each type `a`, a **natural transformation** from the list functor to the `Maybe` functor.

> **Definition (natural transformation).** Given functors $F, G:\mathcal C\to\mathcal D$, a natural transformation $\alpha : F\Rightarrow G$ assigns to each object $a$ an arrow (its *component*)
>
> $$\alpha_a : F\,a\to G\,a$$
>
> such that for every $f : a\to b$ the **naturality square** commutes:
>
> $$G\,f\circ\alpha_a = \alpha_b\circ F\,f.$$

In Haskell: `fmap f . alpha == alpha . fmap f`, where the left `fmap` is `G`'s and the right one is `F`'s.

### 10.2 Checking Naturality of safeHead

Two cases, by equational reasoning:

```text
-- empty list
fmap f (safeHead [])        = fmap f Nothing = Nothing
safeHead (fmap f [])        = safeHead []    = Nothing

-- non-empty list
fmap f (safeHead (x : xs))  = fmap f (Just x) = Just (f x)
safeHead (fmap f (x : xs))  = safeHead (f x : fmap f xs) = Just (f x)
```

Both sides agree, so `safeHead` is natural.

### 10.3 Naturality Is an Optimization

Naturality says you can map before or after the transformation and get the same answer. That has a real cost implication:

```haskell
fmap expensive (safeHead xs)    -- calls expensive at most once
safeHead (fmap expensive xs)    -- in a strict language: calls it length xs times
```

In Haskell, laziness hides the difference; in a strict language, naturality licenses the compiler (or you) to move the `fmap` to the cheaper side. Many stream-fusion and query-optimization rewrites are naturality squares in disguise.

### 10.4 Naturality for Free: Parametricity

In Haskell, any function of type `forall a. F a -> G a` (with `F`, `G` functors) is automatically natural. The reason is **parametricity**: a polymorphic function cannot inspect values of type `a`, so it can only rearrange, drop, or duplicate them. Whatever it does to structure, it does the same way whatever the elements are; mapping `f` over elements before or after cannot make a difference. Wadler called this "theorems for free".

More examples:

```haskell
length' :: [a] -> Const Int a       -- natural transformation into Const
length' xs = Const (length xs)

maybeToList :: Maybe a -> [a]
maybeToList Nothing  = []
maybeToList (Just x) = [x]

-- Two different natural transformations from Reader () to Maybe:
dumb :: (() -> a) -> Maybe a
dumb _ = Nothing

obvious :: (() -> a) -> Maybe a
obvious g = Just (g ())
```

### 10.5 The Functor Category

For fixed categories $\mathcal C$ and $\mathcal D$, functors $\mathcal C\to\mathcal D$ are the objects of a new category $[\mathcal C,\mathcal D]$, whose arrows are natural transformations. Composition is **vertical composition**, componentwise:

$$
(\beta\cdot\alpha)_a = \beta_a\circ\alpha_a.
$$

In Haskell: `beta . alpha`. Natural transformations can also be composed **horizontally** when the functors themselves compose, e.g. turning `F (G a)` into `F' (G' a)`; the two compositions obey an interchange law. This makes Cat a *2-category*: objects (categories), arrows (functors), and arrows between arrows (natural transformations). We need only vertical composition for monads.

### Exercises

1. Verify naturality of `maybeToList` by case analysis.
2. Show that `reverse :: [a] -> [a]` is a natural transformation from the list functor to itself.
3. Why can a function of type `forall a. [a] -> [a]` never sort its input?

### What to Remember

- A natural transformation is a family of arrows $\alpha_a : F\,a\to G\,a$ that commutes with `fmap`.
- In Haskell, polymorphic functions between functors are natural for free.
- Naturality is a license to move `fmap` across a transformation, which is often an optimization.

## 11. Limits and Colimits

Products, terminal objects, and several other constructions are special cases of one idea. This section is short; it is here because adjunctions and the Yoneda lemma are much easier once you have seen it.

### 11.1 Cones

A **diagram** in $\mathcal C$ is a small picture: some objects and some arrows between them. A **cone** over the diagram is an object $c$ (the apex) with an arrow from $c$ to every object in the diagram, such that all triangles formed with the diagram's arrows commute.

The **limit** of the diagram is the universal cone: every other cone factors through it by a unique arrow.

### 11.2 Familiar Limits

| Diagram | Limit | In Set / Hask |
|---|---|---|
| empty | terminal object | `()` |
| two objects, no arrows | product | `(a, b)` |
| two parallel arrows $f, g : a\to b$ | equalizer | $\lbrace x\in a : f\,x = g\,x\rbrace$ |
| $f : a\to c$, $g : b\to c$ | pullback | pairs $(x,y)$ with $f\,x=g\,y$ |

The pullback is worth a programming example. If $a$ is a table of orders, $b$ a table of customers, $f$ the customer id of an order and $g$ the id of a customer, then the pullback is the set of matching pairs: **the SQL join**. A database join is a limit.

### 11.3 Colimits

Dually, a **cocone** has arrows *into* the apex, and a **colimit** is the universal cocone:

| Diagram | Colimit | In Set |
|---|---|---|
| empty | initial object | empty set |
| two objects | coproduct | disjoint union |
| two parallel arrows | coequalizer | quotient by $f\,x\sim g\,x$ |
| $f : c\to a$, $g : c\to b$ | pushout | glue $a$ and $b$ along $c$ |

### 11.4 Hom-Functors Preserve Limits

One fact we will use: the functor $\mathcal C(x,-)$ turns limits into limits. For products,

$$
\mathcal C(x, a\times b)\cong\mathcal C(x,a)\times\mathcal C(x,b),
$$

which is the product factorizer once again. In Haskell, `x -> (a, b)` is the same as `(x -> a, x -> b)`.

### What to Remember

- A limit is a universal cone over a diagram; a colimit is a universal cocone.
- Terminal objects, products, equalizers, and pullbacks (joins) are limits.
- Hom-functors preserve limits, which is the abstract form of "a function into a pair is a pair of functions".

## 12. Free Monoids

### 12.1 What Is the "Freest" Monoid?

Take a set of generators, say $\lbrace a, b\rbrace$. What is the smallest monoid that contains them and satisfies no equations except the monoid laws? We must be able to multiply generators, so we need $ab$, $ba$, $aab$, and so on; we need a neutral element, the empty word. Associativity says we do not need parentheses. The result is the set of **all finite words** over the generators, with concatenation. In Haskell, that is `[a]`: **the list type is the free monoid on `a`.**

### 12.2 The Universal Property

Why is "free" the right word? Because a list can be interpreted in any monoid, and in exactly one way once we decide what single elements mean.

> **Universal property.** For any monoid `m` and any function `h :: a -> m`, there is exactly one monoid homomorphism `h' :: [a] -> m` with `h' [x] = h x`.

A monoid homomorphism must send `[]` to `mempty` and `xs ++ ys` to `h' xs <> h' ys`. Since every list is a concatenation of singletons, these rules leave no choice:

```haskell
foldMap :: Monoid m => (a -> m) -> [a] -> m
foldMap h = mconcat . map h

-- foldMap Sum     [1, 2, 3]       == Sum 6
-- foldMap Product [1, 2, 3, 4]    == Product 24
-- foldMap (\w -> [length w]) ["a", "bcd"] == [1, 3]
-- foldMap show    [1, 2, 3]       == "123"
```

### 12.3 Why It Matters in Software

The free monoid separates **describing** a sequence of things from **interpreting** it. A list of log events, a list of SQL fragments, a list of drawing commands: build the list freely, then choose an interpretation by choosing a monoid and a function on single elements. The same pattern scales up: free monads (built the same way, one level higher) separate the description of an effectful program from its interpreter.

{% include figure.html image="/assets/img/posts/category-theory/adjunction-free-forgetful.svg" alt="Free and forgetful adjunction showing raw generators becoming structured lists and structure being forgotten back to carriers." caption="Free/forgetful adjunctions explain a common software pattern: build syntax or structure freely, then interpret it through laws." %}

### What to Remember

- The free monoid on `a` is `[a]`.
- Every function `a -> m` into a monoid extends uniquely to a homomorphism `[a] -> m`: that is `foldMap`.
- Free constructions separate syntax from interpretation.

## 13. Representable Functors

### 13.1 The Hom-Functor

Fix a type `a`. The construction `x ↦ (a -> x)` is a functor (it is Reader), with `fmap` given by post-composition. In categorical notation it is $\mathcal C(a,-)$, the **hom-functor**.

### 13.2 Representability

A functor `f` is **representable** if it is naturally isomorphic to some hom-functor $\mathcal C(a,-)$. The object $a$ is the *representing object*. In Haskell:

```haskell
{-# LANGUAGE TypeFamilies #-}

class Representable f where
  type Rep f
  tabulate :: (Rep f -> x) -> f x
  index    :: f x -> Rep f -> x
-- tabulate and index are inverse natural transformations
```

Think of `index` as "look up a position" and `tabulate` as "build the structure from a function on positions".

**Example: a pair of equal-typed values.** Positions are `Bool`.

```haskell
data Pair x = Pair x x

instance Representable Pair where
  type Rep Pair = Bool
  index (Pair x _) False = x
  index (Pair _ y) True  = y
  tabulate f = Pair (f False) (f True)
```

**Example: infinite streams.** Positions are natural numbers.

```haskell
data Stream x = Cons x (Stream x)

instance Representable Stream where
  type Rep Stream = Integer
  tabulate f = Cons (f 0) (tabulate (f . (+ 1)))
  index (Cons b bs) n = if n == 0 then b else index bs (n - 1)
```

`tabulate` is **memoization**: it turns a function on naturals into a lazily built table. `index` reads the table back.

**Non-example: lists.** If `[]` were representable, `index [] :: Rep [] -> x` would have to produce an `x` from nothing whenever `Rep []` is inhabited. A container that can be empty, or whose shape varies, cannot be a plain function from a fixed set of positions.

### What to Remember

- A representable functor is "secretly a function type" `Rep f -> x`.
- `tabulate`/`index` convert between a function and its table; this is memoization.
- Fixed-shape containers are representable; variable-shape ones (lists, `Maybe`) are not.

## 14. The Yoneda Lemma

### 14.1 The Statement for Programmers

Consider a polymorphic function of type

```haskell
alpha :: forall x. (a -> x) -> F x
```

for some functor `F`. It takes any way of turning `a`s into `x`s and produces an `F x`. How many such functions are there? The Yoneda lemma says: **exactly as many as there are values of type `F a`.**

$$
\mathrm{Nat}(\mathcal C(a,-), F)\;\cong\; F\,a.
$$

### 14.2 The Proof, Step by Step

**From `alpha` to a value.** Choose `x = a` and pass the only function we have for free, `id :: a -> a`:

```haskell
fa = alpha id   -- fa :: F a
```

**From a value to `alpha`.** Given `fa :: F a`, define

```haskell
alpha h = fmap h fa
```

**Round trip 1.** Starting from `fa`, build `alpha`, then apply it to `id`: `fmap id fa = fa` by the functor identity law.

**Round trip 2.** Starting from `alpha`, compute `fa = alpha id`, then rebuild `alpha' h = fmap h (alpha id)`. We must show `alpha' h = alpha h`. This is where naturality enters. The naturality square for `alpha` with the arrow `h : a -> x` reads

```text
fmap h (alpha g) == alpha (h . g)      -- for any g :: a -> a
```

Choosing `g = id`:

```text
alpha' h = fmap h (alpha id) = alpha (h . id) = alpha h
```

So the two constructions are inverse. The whole proof is: **evaluate at `id`, then use naturality.**

### 14.3 A Concrete Instance

Let `F = []` and `a = Int`. Suppose

```haskell
alpha :: forall x. (Int -> x) -> [x]
alpha h = [h 1, h 2, h 3]
```

Then `alpha id = [1, 2, 3]`, and indeed `alpha h = fmap h [1, 2, 3]`. A polymorphic function of this type has no choice: it must secretly hold a list of `Int`s and map over it. Parametricity forbids anything else.

{% include figure.html image="/assets/img/posts/category-theory/yoneda-programmer-view.svg" alt="Yoneda correspondence between a value in F a and a polymorphic mapper from a to x into F x." caption="Yoneda turns polymorphic mapping behavior into data: if behavior is natural, it is often determined by a small core value." %}

### 14.4 Consequences

**Continuation-passing style.** Take `F` to be the identity functor:

$$
a\;\cong\;\forall r.\,(a\to r)\to r.
$$

```haskell
toCPS :: a -> (forall r. (a -> r) -> r)
toCPS x = \k -> k x

fromCPS :: (forall r. (a -> r) -> r) -> a
fromCPS f = f id
```

A value is equivalent to "the ability to pass that value to any continuation". CPS transforms in compilers rely on this.

**The Yoneda embedding.** Taking `F` itself to be a hom-functor, $F = \mathcal C(b,-)$:

$$
\mathrm{Nat}(\mathcal C(a,-),\mathcal C(b,-))\cong\mathcal C(b,a).
$$

Natural transformations between hom-functors correspond exactly to arrows (in the reverse direction). The philosophical reading: **an object is completely determined by its relationships to all other objects.** This is the precise sense in which "objects are opaque" loses no information.

**Fmap fusion.** The isomorphism can be packaged as a data type:

```haskell
{-# LANGUAGE RankNTypes #-}

newtype Yoneda f a = Yoneda { runYoneda :: forall x. (a -> x) -> f x }

toYoneda :: Functor f => f a -> Yoneda f a
toYoneda fa = Yoneda (\h -> fmap h fa)

fromYoneda :: Yoneda f a -> f a
fromYoneda y = runYoneda y id

instance Functor (Yoneda f) where
  fmap g y = Yoneda (\h -> runYoneda y (h . g))
```

Mapping over `Yoneda f` only composes functions; the real `fmap` of `f` runs once, in `fromYoneda`. A chain of `n` maps over a large structure becomes one traversal. Libraries use this trick to optimize generic code.

### Exercises

1. Use Yoneda to count the total functions of type `forall x. (Bool -> x) -> Maybe x`. (Answer: as many as values of `Maybe Bool`, i.e. 3.)
2. Show that `forall x. (a -> x) -> (b -> x)` is isomorphic to `b -> a`.
3. Implement `fmap` for `Yoneda f` and check that it does not need `Functor f`.

### What to Remember

- Yoneda: natural transformations out of $\mathcal C(a,-)$ correspond to values of $F\,a$.
- Proof: evaluate at `id`; naturality rebuilds everything else.
- Consequences: CPS, the Yoneda embedding ("an object is its relationships"), and fmap fusion.

## 15. Adjunctions

### 15.1 Weakening "Inverse"

Functors rarely have inverses. An isomorphism of categories is too strong to be common. An **adjunction** is a weaker, far more common relationship: two functors that are "as close to inverse as possible" in a precise sense.

### 15.2 Definition via Hom-Sets

> **Definition (adjunction).** Functors $L:\mathcal D\to\mathcal C$ and $R:\mathcal C\to\mathcal D$ are adjoint, written $L\dashv R$, if there is a bijection
>
> $$\mathcal C(L\,d, c)\;\cong\;\mathcal D(d, R\,c)$$
>
> natural in both $d$ and $c$. $L$ is the **left adjoint**, $R$ the **right adjoint**.

Read it as: "maps out of $L\,d$ in $\mathcal C$ are the same as maps into $R\,c$ in $\mathcal D$". You can always trade a question about one category for a question about the other.

### 15.3 Three Examples

**Currying.** With $L = (-\times a)$ and $R = (a\Rightarrow -)$, both endofunctors on Hask:

$$
\mathcal C(z\times a, b)\cong\mathcal C(z, b^a).
$$

This is exactly section 9. The product functor is left adjoint to the exponential.

**Free/forgetful.** Let $U$: Mon $\to$ Set forget the monoid structure, and let Free: Set $\to$ Mon build lists. Then

$$
\mathrm{Mon}(\mathrm{Free}\,x, m)\cong\mathrm{Set}(x, U\,m),
$$

which is section 12: homomorphisms out of a list monoid correspond to plain functions on generators (`foldMap`). Free constructions are left adjoints to forgetful functors, all over mathematics and programming.

**Floor and ceiling.** View the integers $\mathbb Z$ and reals $\mathbb R$ as ordered sets (thin categories), with the inclusion $i:\mathbb Z\to\mathbb R$. For every integer $n$ and real $x$,

$$
i(n)\le x\iff n\le\lfloor x\rfloor.
$$

That is precisely a bijection of hom-sets (each has zero or one element), so $i\dashv\lfloor\cdot\rfloor$: the floor function is right adjoint to the inclusion. Dually, $\lceil x\rceil\le n\iff x\le i(n)$, so the ceiling is left adjoint to the inclusion. Adjunctions between orders are called Galois connections.

### 15.4 Unit and Counit

Setting $c = L\,d$ in the hom-set bijection and feeding in $$\mathrm{id}_{L\,d}$$ gives a natural transformation, the **unit**

$$
\eta : \mathrm{Id}_{\mathcal D}\Rightarrow R\circ L.
$$

Setting $d = R\,c$ and feeding in $$\mathrm{id}_{R\,c}$$ gives the **counit**

$$
\varepsilon : L\circ R\Rightarrow \mathrm{Id}_{\mathcal C}.
$$

For currying: the unit is `\z -> \a -> (z, a)` and the counit is `eval`. For free/forgetful: the unit is `\x -> [x]` and the counit is `mconcat`. The unit and counit satisfy two **triangle identities**, and conversely any pair satisfying them determines an adjunction.

### 15.5 The Payoff: Every Adjunction Gives a Monad

The composite $R\circ L : \mathcal D\to\mathcal D$ is an endofunctor. The unit $\eta$ gives a map $a\to R\,L\,a$, and the counit, sandwiched in the middle, gives a map

$$
R\,L\,R\,L\,a\xrightarrow{\;R\,\varepsilon_{L a}\;} R\,L\,a.
$$

These will turn out to be `return` and `join`. For the currying adjunction with a fixed state type `s`:

$$
R(L\,a) = s\Rightarrow(a\times s),
$$

which is the **State monad** `s -> (a, s)`. The state monad is not an arbitrary invention: it falls out of currying.

### What to Remember

- $L\dashv R$ means $\mathcal C(L\,d,c)\cong\mathcal D(d,R\,c)$, naturally.
- Currying, free/forgetful, and floor/inclusion are adjunctions.
- Unit $\eta : \mathrm{Id}\Rightarrow RL$ and counit $\varepsilon : LR\Rightarrow\mathrm{Id}$.
- $R\circ L$ is always a monad; State comes from currying.

## 16. Monads

### 16.1 Three Equivalent Definitions

We met the idea in section 4: a type constructor `m` whose embellished functions `a -> m b` compose. There are three equivalent ways to present a monad.

**Fish (Kleisli) form.**

```haskell
(>=>)  :: (a -> m b) -> (b -> m c) -> (a -> m c)
return :: a -> m a
-- Laws: return >=> f == f,  f >=> return == f,
--       (f >=> g) >=> h == f >=> (g >=> h)
```

**Bind form.** Haskell's `Monad` class uses bind:

```haskell
(>>=) :: m a -> (a -> m b) -> m b
-- Laws:
--   return x >>= f   ==  f x
--   m >>= return     ==  m
--   (m >>= f) >>= g  ==  m >>= (\x -> f x >>= g)
```

**Join form.** The categorical definition uses `fmap` and `join`:

```haskell
join :: m (m a) -> m a
```

They are interdefinable:

```haskell
f >=> g   = \x -> f x >>= g
ma >>= f  = join (fmap f ma)
join mma  = mma >>= id
```

The join form explains the essence: a monad is a functor where **two layers of effect can be flattened into one**, and `return` adds a trivial layer.

### 16.2 do-Notation

`do` blocks are syntax for nested binds:

```haskell
do x <- mx
   y <- my x
   return (x, y)

-- means
mx >>= \x -> my x >>= \y -> return (x, y)
```

Read it as an imperative program, but remember it is an ordinary expression whose "semicolon" is `>>=`. **A monad is a programmable semicolon.**

### 16.3 The Standard Examples

**Maybe: computations that may fail.**

```haskell
safeDiv :: Double -> Double -> Maybe Double
safeDiv _ 0 = Nothing
safeDiv x y = Just (x / y)

safeSqrt :: Double -> Maybe Double
safeSqrt x
  | x < 0     = Nothing
  | otherwise = Just (sqrt x)

rootOfRatio :: Double -> Double -> Maybe Double
rootOfRatio a b = do
  q <- safeDiv a b
  safeSqrt q
-- rootOfRatio 8 2 == Just 2.0;  rootOfRatio 1 0 == Nothing
```

The first `Nothing` short-circuits the rest: exceptions without exceptions.

**List: nondeterminism.**

```haskell
import Control.Monad (guard)

triples :: Int -> [(Int, Int, Int)]
triples n = do
  z <- [1 .. n]
  x <- [1 .. z]
  y <- [x .. z]
  guard (x * x + y * y == z * z)
  return (x, y, z)
-- triples 15 == [(3,4,5),(6,8,10),(5,12,13),(9,12,15)]
```

Bind tries every choice; `guard` prunes. Here `join` is `concat`.

**Reader: shared read-only environment.** `r -> a`, where bind passes the same environment to both computations. Useful for configuration.

**Writer: accumulated output.** `(a, w)` with `w` a monoid, from section 4.

**State: threaded state.** From the currying adjunction:

```haskell
newtype State s a = State { runState :: s -> (a, s) }

instance Functor (State s) where
  fmap f (State g) = State $ \s -> let (a, s') = g s in (f a, s')

instance Applicative (State s) where
  pure a = State $ \s -> (a, s)
  State gf <*> State ga = State $ \s ->
    let (f, s1) = gf s
        (a, s2) = ga s1
    in  (f a, s2)

instance Monad (State s) where
  State g >>= k = State $ \s ->
    let (a, s1) = g s
    in  runState (k a) s1

get :: State s s
get = State $ \s -> (s, s)

put :: s -> State s ()
put s = State $ \_ -> ((), s)

fresh :: State Int String
fresh = do
  n <- get
  put (n + 1)
  return ("v" ++ show n)

-- runState (mapM (const fresh) [1, 2, 3]) 0 == (["v0","v1","v2"], 3)
```

This is exactly how a compiler generates fresh variable names without global mutable state.

**IO.** Conceptually `IO a` is like `State World a`: a computation that transforms the state of the whole world and returns an `a`. The `World` is never actually passed around, but the sequencing discipline is the same.

{% include figure.html image="/assets/img/posts/category-theory/monad-kleisli-sequencing.svg" alt="Monad diagram showing return, bind, join, and Kleisli composition for contextual functions." caption="Monads make contextual computation compositional: bind connects effectful arrows while preserving identity and associativity laws." %}

### 16.4 Functor, Applicative, Monad

Between functors and monads sits the **applicative functor**:

```haskell
class Functor f => Applicative f where
  pure  :: a -> f a
  (<*>) :: f (a -> b) -> f a -> f b
```

The difference is about dependency:

| Interface | What you can do | Example |
|---|---|---|
| Functor | apply a pure function inside one effect | `fmap (+1) (Just 2)` |
| Applicative | combine *independent* effects | validate two form fields, run both |
| Monad | let a later effect *depend* on an earlier result | read a file name, then read that file |

Prefer the weakest interface that does the job: applicative code can be analysed, parallelized, and batched in ways that monadic code cannot, because its structure is known before it runs.

### 16.5 A Monad Is a Monoid in the Category of Endofunctors

The famous slogan is now a short calculation. Compare:

| | Monoid | Monad |
|---|---|---|
| lives in | Set | endofunctors $[\mathcal C,\mathcal C]$ |
| carrier | a set $M$ | a functor $T$ |
| "tensor product" | cartesian product $\times$ | functor composition $\circ$ |
| unit object | singleton $1$ | identity functor $\mathrm{Id}$ |
| multiplication | $\mu : M\times M\to M$ | $\mu : T\circ T\Rightarrow T$ (`join`) |
| unit | $\eta : 1\to M$ | $\eta : \mathrm{Id}\Rightarrow T$ (`return`) |
| associativity | $(xy)z = x(yz)$ | flattening three layers in either order agrees |
| identity | $1\cdot x = x = x\cdot 1$ | `join . return = id = join . fmap return` |

The monad laws are the monoid laws, transported from sets to functors. And section 3 told us a monoid is a one-object category; section 4 told us a monad's Kleisli arrows form a category. The circle closes.

### Exercises

1. Derive `join` for the list monad from `>>=`, and check that it is `concat`.
2. Write the Writer monad's `>>=` and verify the left identity law.
3. Show that the State monad's `join :: State s (State s a) -> State s a` runs the outer computation, then the inner one, on the updated state.
4. Write a form validator two ways, applicative and monadic. When does the monadic version become necessary?

### What to Remember

- A monad: `return` plus one of `>=>`, `>>=`, or `join`, with identity and associativity laws.
- Maybe = failure, list = nondeterminism, Reader = environment, Writer = log, State = threaded state, IO = world-state.
- Applicative = independent effects; monad = dependent effects.
- A monad is a monoid in the category of endofunctors: same laws, different tensor.

## 17. Recall Map and Limits of the Framework

### 17.1 One-Page Recall

| Concept | Programmer's reading | Key law or property |
|---|---|---|
| Category | composable arrows | associativity, identity |
| Kleisli category | composable effectful functions | monad laws |
| Product / coproduct | tuple / tagged union | unique factorizer |
| Exponential | function type | currying isomorphism |
| Functor | lawful `fmap` | preserves id and composition |
| Natural transformation | polymorphic `F a -> G a` | commutes with `fmap` |
| Free monoid | list | unique extension = `foldMap` |
| Representable functor | container = function on positions | `tabulate`/`index` |
| Yoneda | polymorphic mapper = one value | evaluate at `id` |
| Adjunction | optimal approximate inverse | hom-set bijection |
| Monad | programmable semicolon | monoid in endofunctors |

### 17.2 Where the Framework Is an Approximation

Real languages include nontermination, exceptions, `seq`, mutation, and compiler-specific behaviour, so "Hask" is not literally a category in every corner case. The idealized laws still guide design, but implementations must be tested and documented. The reasoning here is strongest in pure, total code; the further you drift from that, the more the laws become guidelines rather than guarantees.

### 17.3 Where to Go Next

- **Applicative and traversable functors**: effectful iteration (`traverse`, `sequenceA`).
- **Monad transformers and algebraic effects**: combining several effects.
- **Profunctor optics**: lenses and prisms as natural transformations between profunctors.
- **F-algebras and recursion schemes**: folds and unfolds from initial algebras (Milewski chapter 17 and part three).
- **Ends, coends, and Kan extensions**: the remaining chapters of the book.
- **Type theory and categorical logic**: dependent types, toposes, and the semantics of programming languages.

## References and Reading Guide

- B. Milewski, _Category Theory for Programmers_. The primary text; chapters are mapped to sections in the table at the top.
- Uppsala University reading group schedule: [uu-ctfp.github.io](https://uu-ctfp.github.io/).
- S. Awodey, _Category Theory_. A mathematically careful companion; chapters 1-2 (categories, abstract structures), 5 (limits), 7 (naturality), 8 (Yoneda), 9 (adjoints), 10 (monads).
- B. C. Pierce, _Basic Category Theory for Computer Scientists_. Short and gentle; good for a second pass.
- P. Wadler, "Theorems for free!" (1989). Parametricity and why polymorphic functions are natural.
- E. Moggi, "Notions of computation and monads" (1991). The paper that brought monads into programming language semantics.
